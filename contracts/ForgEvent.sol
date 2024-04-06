//contracts/ForgEvent.sol
// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.4;

contract ForgEvent {
    constructor() {}

    //events
    //event to emit when event is created
    event EventCreated(address eventCreator, string eventName, uint eventId);

    //structure of each event
    struct Forg {
        string event_name;
        uint start_timestamp;
        uint end_timestamp;
        uint ticket_count;
        uint ticket_price;
        address creator;
        address[] organizers;
        bool active;
        string eventJsonData;//other data related to event
    }

    mapping(bytes32 => Forg) eventMapping;

    //checks for createEvent function
    modifier checkForCreation(string memory _eventName, uint _startTimestamp, uint _endTimestamp, uint _ticketCount) {
        //must have a name
        require(bytes(_eventName).length != 0, "Must have a name");
        //event can't be in past
        require(_startTimestamp >= block.timestamp && _endTimestamp >= block.timestamp, "Event must be in future");
        //end time must be after start
        require(_startTimestamp > _endTimestamp, "Cannot end event before starting");
        //must atleast have 1 ticket
        require(_ticketCount > 0, "Must have 1 ticket atleast");
        _;
    }

    function createEvent(string memory _eventName, uint[] memory _eventTimestamps, uint[] memory _ticketData, address[] memory _organizers, bool _active, string memory _eventJsonData) checkForCreation(_eventName, _eventTimestamps[0], _eventTimestamps[1], _ticketData[0]) public returns(bytes32) {
        //for creating unique id of each event
        bytes32 uid = keccak256(abi.encode(block.timestamp, msg.sender, _eventName, _eventTimestamps[0], _eventTimestamps[1]));

        //obj of the Forg type to create an event
        Forg memory e = Forg(_eventName, _eventTimestamps[0], _eventTimestamps[1], _ticketData[0], _ticketData[1], msg.sender, _organizers, _active, _eventJsonData);

        //map the uid to each event
        eventMapping[uid] = e;
        return uid;
    }
}