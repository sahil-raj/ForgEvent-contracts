//contracts/ForgEvent.sol
// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ForgEvent is Ownable(msg.sender) {
    constructor() {}

    //events
    //event to emit when event is created
    event EventCreated(address eventCreator, string eventName, bytes32 eventId);

    //structure of each event
    struct Forg {
        string event_name;
        uint start_timestamp;
        uint end_timestamp;
        uint ticket_count;
        uint ticket_price;
        address creator;
        address[] organizers;
        string eventJsonData;//other data related to event
    }

    //mapping to map event id to the event
    mapping(bytes32 => Forg) public forgMapping;

    //mapping to map address to the event id and that too to the number of tickets bought
    mapping(address => mapping(bytes32 => uint)) internal userTickets;

    uint256 private nonce = 0;

    //checks for createEvent function
    modifier checkForCreation(string memory _eventName, uint _startTimestamp, uint _endTimestamp, uint _ticketCount) {
        //must have a name
        require(bytes(_eventName).length != 0, "Must have a name");
        //event can't be in past
        require(_startTimestamp >= block.timestamp && _endTimestamp >= block.timestamp, "Event must be in future");
        //end time must be after start
        require(_startTimestamp <= _endTimestamp, "Cannot end event before starting");
        //must atleast have 1 ticket
        require(_ticketCount > 0, "Must have 1 ticket atleast");
        _;
    }

    modifier buyCheck(bytes32 _eventId, uint _ticketCount) {
        //check if the event exists and is in the future
        require(forgMapping[_eventId].start_timestamp > block.timestamp, "event not available");

        //check if enough tickets are available
        require(forgMapping[_eventId].ticket_count >= _ticketCount, "tickets not available");

        //check if user have sent enough value for all the tickets
        require(msg.value >= _ticketCount*forgMapping[_eventId].ticket_price, "insufficient value");

        _;
    }

    function createEvent(string memory _eventName, uint[] memory _eventTimestamps, uint[] memory _ticketData, address[] memory _organizers, string memory _eventJsonData) checkForCreation(_eventName, _eventTimestamps[0], _eventTimestamps[1], _ticketData[0]) public returns(bytes32) {

        //for creating unique id of each event
        //use nounce to remove conflicting behaviour
        bytes32 uid = keccak256(abi.encode(block.timestamp, msg.sender, _eventName, _eventTimestamps[0], _eventTimestamps[1], nonce));

        //obj of the Forg type to create an event
        Forg memory e = Forg(_eventName, _eventTimestamps[0], _eventTimestamps[1], _ticketData[0], _ticketData[1], msg.sender, _organizers, _eventJsonData);

        //map the uid to each event
        forgMapping[uid] = e;

        //make creator a organizer
        forgMapping[uid].organizers.push(msg.sender);

        //increase nonce for uid
        ++nonce;

        //emit event that the forg is forged!!
        emit EventCreated(msg.sender, _eventName, uid);

        return uid;
    }

    function buyTickets(bytes32 _eventId, uint _ticketCount) buyCheck(_eventId, _ticketCount) public payable returns(bool){
        //transfer funds to owner
        (bool success, ) = owner().call{value: forgMapping[_eventId].ticket_price*_ticketCount}("");
        //continue if the transfer was successful
        require(success, "transaction failed");
        //decrease the total available tickets
        forgMapping[_eventId].ticket_count -= _ticketCount;
        return success;
    }
}

//[1718083510, 1723353910]