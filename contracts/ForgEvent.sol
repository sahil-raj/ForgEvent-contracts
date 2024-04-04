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

    modifier checkForCreation() {
        _;
    }

    function createEvent(uint _eventName, uint _startTimestamp, uint _endTimestamp, uint _ticketCount, uint _ticketPrice, address[] _organizers, bool _active) checkForCreation public returns(bool) {

    }
}