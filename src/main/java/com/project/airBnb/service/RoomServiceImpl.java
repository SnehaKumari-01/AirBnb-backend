package com.project.airBnb.service;

import com.project.airBnb.dto.RoomDto;
import com.project.airBnb.entity.Hotel;
import com.project.airBnb.entity.Room;
import com.project.airBnb.entity.User;
import com.project.airBnb.exception.ResourceNotFoundException;
import com.project.airBnb.exception.UnAuthorisedException;
import com.project.airBnb.repository.HotelRepository;
import com.project.airBnb.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.project.airBnb.util.AppUtil.getCurrentUser;
import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{

    private final RoomRepository roomRepository;
    private final InventoryService inventoryService;
    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;
    @Override
    public RoomDto createNewRoom(Long hotelId,RoomDto roomDto) {
        log.info("Creating a room in hotel with ID: {} ",hotelId);
        Hotel hotel=hotelRepository.findById(hotelId).orElseThrow(()->(new ResourceNotFoundException("Hotel not found with ID:"+hotelId)));

        User user=(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.equals(hotel.getOwner())){
            throw new UnAuthorisedException("This user does not owns this hotel with id: "+hotelId);
        }

        Room room=modelMapper.map(roomDto, Room.class);
        room.setHotel(hotel);
        room=roomRepository.save(room);

        if(hotel.getActive()){
            inventoryService.initializeRoomForAYear(room);
        }
        return modelMapper.map(room,RoomDto.class);

    }

    @Override
    public List<RoomDto> getAllRoomsInHotel(Long hotelId) {
        log.info("Getting a room in hotel with ID: {}",hotelId);
        Hotel hotel=hotelRepository.findById(hotelId).orElseThrow(()->(new ResourceNotFoundException("Hotel not found with ID:"+hotelId)));
        User user=(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.equals(hotel.getOwner())){
            throw new UnAuthorisedException("This user does not owns this hotel with id: "+hotelId);
        }

        return hotel.getRooms()
                .stream()
                .map((element)->modelMapper.map(element,RoomDto.class)).collect(Collectors.toList());
    }

    @Override
    public RoomDto getRoomById(Long roomId) {
        log.info("Getting a room with ID: {} ",roomId);
        Room room=roomRepository.findById(roomId).orElseThrow(()->(new ResourceNotFoundException("Hotel not found with ID:"+roomId)));
        return modelMapper.map(room,RoomDto.class);
    }

    @Override
    @Transactional
    public void deleteRoomById(Long roomId) {
        log.info("Deleting room with ID: {}",roomId);
        Room room=roomRepository.findById(roomId).orElseThrow(()->(new ResourceNotFoundException("Hotel not found with ID:"+roomId)));

        User user=(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.equals(room.getHotel().getOwner())){
            throw new UnAuthorisedException("This user does not owns this room with id: "+roomId);
        }

        //delete the future inventory for this room
        inventoryService.deleteAllInventories(room);
        roomRepository.deleteById(roomId);
    }

    @Override
    @Transactional
    public RoomDto updateRoomById(Long hotelId, Long roomId, RoomDto roomDto) {
        log.info("Updating room with ID: {}",roomId);
        Hotel hotel=hotelRepository.findById(hotelId).orElseThrow(()->(new ResourceNotFoundException("Hotel not found with ID:"+id)));

        User user=getCurrentUser();
        if(!user.equals(hotel.getOwner())){
            throw new UnAuthorisedException("This user does not owns this hotel with id: "+hotelId);
        }
        Room room=roomRepository.findById(roomId).orElseThrow(()->new ResourceNotFoundException("Room not found with ID: "+roomId));
        modelMapper.map(roomDto,room);
        room.setId(roomId);

        //TODO: If price or inventory is updated, then update the inventory for this room
        room=roomRepository.save(room);
        return modelMapper.map(room, RoomDto.class);
    }

}
