/**
 * @author
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */
'use strict';

var http = require('http');

var Candy = require('./Candy');
var Hook = require('./core/Hook');
var WebRestful = require('./web/Restful');
var WebApp = require('./web/Application');
var InvalidConfigException = require('./core/InvalidConfigException');

/**
 * 入口
 */
class CandyJs {
    
    /**
     * constructor
     *
     * @param {JSON} config 配置信息
     */
    constructor(config) {
        if(undefined === config) {
            throw new InvalidConfigException('The app config is required');
        }
        
        this.config = config;
        this.server = null;
        this.app = new WebApp(config);
    }
    
    // web
    requestListenerWeb(req, res) {
        try {
            this.app.requestListener(req, res);
            
        } catch(e) {
            this.app.handlerException(res, e);
        }
    }
    
    // restful
    requestListenerRestful(req, res) {
        try {
            WebRestful.requestListener(req, res);
            
        } catch(e) {
            this.app.handlerException(res, e);
        }
    }
    
    // handler
    handler(req, res) {
        Hook.getInstance().trigger(req, res, () => {
            if(true === this.config.useRestful) {
                this.requestListenerRestful(req, res);
                return;
            }
            
            this.requestListenerWeb(req, res);
        });
    }
    
    /**
     * 获取 http server
     *
     * @return http server
     */
    getServer() {
        return http.createServer(this.handler.bind(this));
    }
    
    /**
     * listen
     *
     * @param {Number} port
     * @param {Function} callback
     *
     * If you want to create HTTPS server you can do so as shown here
     *
     * var https = require('https');
     * var CandyJs = require('candyjs');
     * var app = new CandyJs({ ... });
     * https.createServer({ ... }, app.handler.bind(app)).listen(443);
     *
     */
    listen(port, callback) {
        this.server = this.getServer();
        this.server.listen(port, callback);
    }
    
}

/**
 * handler
 */
CandyJs.Candy = Candy;

module.exports = CandyJs;