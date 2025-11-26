import $ from 'jquery';

class Queue {
    constructor(id) {
        this.id = id;
    }

    start(time) {
        setTimeout(() => {
            $('#payout-btn-' + this.id).css('transform', '');            
        }, time);
    }
}

export default Queue;