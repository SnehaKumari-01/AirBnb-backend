package com.project.airBnb.service;

import com.project.airBnb.dto.UpdateInventoryRequestDto;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import com.project.airBnb.dto.HotelPriceDto;
import com.project.airBnb.dto.HotelSearchRequestDto;
import com.project.airBnb.dto.InventoryDto;
import com.project.airBnb.entity.Inventory;
import com.project.airBnb.entity.Room;
import com.project.airBnb.entity.User;
import com.project.airBnb.exception.ResourceNotFoundException;
import com.project.airBnb.repository.HotelMinPriceRepository;
import com.project.airBnb.repository.InventoryRepository;
import com.project.airBnb.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import static com.project.airBnb.util.AppUtil.getCurrentUser;

@Service
@Slf4j
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService{
    private final RoomRepository roomRepository;

    private final InventoryRepository inventoryRepository;
    private final ModelMapper modelMapper;
    private final HotelMinPriceRepository hotelMinPriceRepository;

    @Override
    public void initializeRoomForAYear(Room room) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusYears(1);
        for(; !today.isAfter(endDate);today=today.plusDays(1)){
            Inventory inventory= Inventory.builder()
                    .hotel(room.getHotel())
                    .room(room)
                    .bookedCount(0)
                    .reservedCount(0)
                    .city(room.getHotel().getCity())
                    .date(today)
                    .price(room.getBasePrice())
                    .surgeFactor(BigDecimal.ONE)
                    .totalCount(room.getTotalCount())
                    .closed(false)
                    .build();
            inventoryRepository.save(inventory);
        }
    }

    @Override
    public void deleteAllInventories(Room room) {
        log.info("Deleting the inventories of room with id: {}",room.getId());
        LocalDate today=LocalDate.now();
        inventoryRepository.deleteByRoom(room);
    }

    @Override
    public Page<HotelPriceDto> searchHotels(HotelSearchRequestDto hotelSearchRequestDto) {
        log.info("Searching hotels for {} city, from {} to {}",hotelSearchRequestDto.getCity(),hotelSearchRequestDto.getStartDate(),hotelSearchRequestDto.getEndDate());
        Pageable pageable= PageRequest.of(hotelSearchRequestDto.getPage(),hotelSearchRequestDto.getSize());
        long dateCount= ChronoUnit.DAYS.between(hotelSearchRequestDto.getStartDate(),hotelSearchRequestDto.getEndDate())+1;

        //business logic - 90 days

        Page<HotelPriceDto> hotelPage=hotelMinPriceRepository.findHotelWithAvailableInventory(hotelSearchRequestDto.getCity(),hotelSearchRequestDto.getStartDate(),hotelSearchRequestDto.getEndDate(),hotelSearchRequestDto.getRoomsCount(),pageable);
        return hotelPage;
    }

    @Override
    public List<InventoryDto> getAllInventoryByRoom(Long roomId) {
        log.info("Getting all inventory by room for room with id: {}",roomId);
        Room room=roomRepository.findById(roomId)
                .orElseThrow(()->new ResourceNotFoundException("Room not found with id: "+roomId));
        User user=getCurrentUser();
        if(!user.equals(room.getHotel().getOwner())) throw new AccessDeniedException("You are not the owner of room with id: "+roomId);
        return inventoryRepository.findByRoomOrderByDate(room).stream()
                .map((element)->modelMapper.map(element,InventoryDto.class)).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateInventory(Long roomId, UpdateInventoryRequestDto updateInventoryRequestDto) {
        log.info("Updating all inventory by room for room with id: {} between date range: {} - {}",roomId,updateInventoryRequestDto.getStartDate(),updateInventoryRequestDto.getEndDate());
        Room room=roomRepository.findById(roomId)
                .orElseThrow(()->new ResourceNotFoundException("Room not found with id: "+roomId));
        User user=getCurrentUser();
        if(!user.equals(room.getHotel().getOwner())) throw new AccessDeniedException("You are not the owner of room with id: "+roomId);

        inventoryRepository.getInventoryAndLockBeforeUpdate(roomId,updateInventoryRequestDto.getStartDate(),updateInventoryRequestDto.getEndDate());

        inventoryRepository.updateInventory(roomId,updateInventoryRequestDto.getStartDate(),updateInventoryRequestDto.getEndDate(),updateInventoryRequestDto.getClosed(),updateInventoryRequestDto.getSurgeFactor());
    }
}
