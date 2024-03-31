//contracts/ForgEvent.sol
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract ForgEvent {
    constructor() {
    }

    struct Forg {
        string name;
        uint u_id;
        bool active;
        uint total_ticket_supply;
        uint ticket_price;
        uint start_timestamp;
        uint end_timestamp;
        address[] organisers;
    }

    mapping(address => Forg) eventOrganizer;
}
