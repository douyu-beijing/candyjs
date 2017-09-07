/**
 * @author
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */
'use strict';

var Event = require('../core/Event');

/**
 * base target
 */
class ITarget extends Event {
    
    /**
     * constructor
     */
    constructor() {
        super();
        
        /**
         * @property {String} fileExtension 文件扩展名
         */
        this.fileExtension = '.log';
        
        /**
         * @property {String} EVENT_FLUSH 事件
         */
        this.EVENT_FLUSH = 'flush';
    }
    
    /**
     * flush log
     *
     * @param {Array} message the message to be logged
     */
    flush(messages) {}
    
    /**
     * 触发事件
     *
     * @param {String} eventName 事件名称
     * @param {Array} param 参数
     */
    trigger(eventName, param) {
        if(undefined !== this.handlers[eventName]) {
            for(let handler of this.handlers[eventName]) {
                handler.flush(param);
            }
        }
    }
    
}

module.exports = ITarget;