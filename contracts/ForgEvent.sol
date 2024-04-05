//contracts/ForgEvent.sol
//SPDX-License-Identifier: MIT

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

contract ForgEvent {
    constructor() {}

    struct Forg {
        string event_name;
        uint start_timestamp;
        uint end_timestamp;
        uint ticket_count;
        uint ticket_price;
        address creator;
        address[] organizers;
        bool active;
    }

    modifier checkForCreation(uint _startTimestamp, uint _endTimestamp, uint _ticketCount) {
        //event can't be in past
        require(_startTimestamp >= block.timestamp && _endTimestamp >= block.timestamp, "Event must be in future");
        //end time must be after start
        require(_startTimestamp > _endTimestamp, "Cannot end event before starting");
        //must atleast have 1 ticket
        require(_ticketCount > 0, "Must have 1 ticket atleast");
        _;
    }

    function createEvent(uint _eventName, uint _startTimestamp, uint _endTimestamp, uint _ticketCount, uint _ticketPrice, address[] _organizers, bool _active) checkForCreation(_startTimestamp, _endTimestamp, _ticketCount) public returns(bool) {

    }
}