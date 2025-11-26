import * as PIXI from "pixi.js";
import * as Phaser from "phaser";
import * as PIXIFilter from "pixi-filters";
import gsap from "gsap";
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { BaseLayer } from "./BaseLayer";
import { gameApp } from "../index";
import { GAME_STATE, MAX_COUNTDOWN, MAX_FLY_FRAME } from "../data/Constant";
// import { Text } from "pixi.js";
// import { StartTwoTone } from "@mui/icons-material";

export class CrashLayer extends BaseLayer {

    spr_bg              = null;
    spr_rocket          = null;
    spr_explosion       = null;

    container_timeline  = null;
    container_history   = null;
    container_crash     = null;
    container_countdown = null;

    texture_history     = null;
    texture_coin        = null;
    texture_cashout     = null;

    graphic_curve       = null;
    graphic_countdown   = null;

    pos_timeline_x      = null;
    pos_timeline_y      = null;
    pos_rocket          = null;
    pos_history         = null;   
    pos_crash           = null;  

    scale_history       = 1.0;
    scale_timeline      = 1.0;
    scale_crash         = 1.0;
    scale_countdown     = 1.0;
    
    explosion_started   = false;
    isMobile            = false;

    xAix = [0, 2, 4, 6, 8, 10];
    yAix = [1.0, 1.2, 1.3, 1.35, 1.4];

    history             = [];

    init(resource) {
        super.init(resource);

        this.texture_coin = [
            resource.coin_bnb,
            resource.coin_btc,
            resource.coin_eth,
            resource.coin_trx,
            resource.coin_usdt,
            resource.coin_zelo
        ];
        this.texture_cashout = resource.crash;

        this.resetAspect();

        this.createBg(resource);
        this.createTimeline();
        this.createRocket(resource);
        this.createHistory(resource);
        this.createCrash();
        this.createCountdown();
        this.createExplosion(resource);
    }

    onResize(width, height) {
        super.onResize(width, height);
        
        this.resetAspect();
    }

    updateRender(frame, state, speed) {
        this.renderBg();
        this.renderTimeline(state);
        this.renderRocket(frame, state);
        this.renderHistory(state);
        this.renderCrash(state);
        this.renderCountdown(frame, state);
        this.renderExplosion(state);
    }

    resetAspect() {
        if(gameApp.canvas_width >= 888) {
            this.pos_timeline_x = {x1: 125.0 * gameApp.scale_x, x2: gameApp.canvas_width - 49.0 * gameApp.scale_x, y: gameApp.canvas_height - 43.0 * gameApp.scale_y};
            this.pos_timeline_y = {x: 32.0 * gameApp.scale_x, y1: 197.0 * gameApp.scale_y, y2: gameApp.canvas_height - 132.0 * gameApp.scale_y}; 
            this.pos_history = {x: 32.0 * gameApp.scale_x, y: 81.0 * gameApp.scale_y};    
            this.pos_crash = {x: gameApp.canvas_width / 2, y1: gameApp.canvas_height / 2 - 136.0 * gameApp.scale_y, y2: gameApp.canvas_height / 2 - 85.0 * gameApp.scale_y}; 

            let curve_rocket = [
                {x: 115.0 * gameApp.scale_x, y: gameApp.canvas_height - 140.0 * gameApp.scale_y},
                {x: 400.0 * gameApp.scale_x, y: gameApp.canvas_height - 130.0 * gameApp.scale_y},
                {x: gameApp.canvas_width - 300 * gameApp.scale_x, y: 650 * gameApp.scale_y},
                {x: gameApp.canvas_width - 140.0 * gameApp.scale_x, y: 290.0 * gameApp.scale_y}
            ];
    
            this.pos_rocket = new Phaser.Curves.CubicBezier(curve_rocket[0], curve_rocket[1], curve_rocket[2], curve_rocket[3]);

            this.scale_history = 1.0;
            this.scale_timeline = 1.0;
            this.scale_crash = 1.0;
            this.scale_countdown = 1.0;
            this.isMobile = false;
        }
        else {
            this.pos_timeline_x = {x1: 125.0 * gameApp.scale_x, x2: gameApp.canvas_width - 49.0 * gameApp.scale_x, y: gameApp.canvas_height - 193.0 * gameApp.scale_y};
            this.pos_timeline_y = {x: 32.0 * gameApp.scale_x, y1: 197.0 * gameApp.scale_y, y2: gameApp.canvas_height - 267.0 * gameApp.scale_y}; 
            this.pos_history = {x: 32.0 * gameApp.scale_x, y: 81.0 * gameApp.scale_y};    
            this.pos_crash = {x: gameApp.canvas_width / 2, y1: gameApp.canvas_height / 2 - 186.0 * gameApp.scale_y, y2: gameApp.canvas_height / 2 - 135.0 * gameApp.scale_y}; 

            let curve_rocket = [
                {x: 115.0 * gameApp.scale_x, y: gameApp.canvas_height - 270.0 * gameApp.scale_y},
                {x: 400.0 * gameApp.scale_x, y: gameApp.canvas_height - 260.0 * gameApp.scale_y},
                {x: gameApp.canvas_width - 270 * gameApp.scale_x, y: 500 * gameApp.scale_y},
                {x: gameApp.canvas_width - 140.0 * gameApp.scale_x, y: 290.0 * gameApp.scale_y}
            ];
    
            this.pos_rocket = new Phaser.Curves.CubicBezier(curve_rocket[0], curve_rocket[1], curve_rocket[2], curve_rocket[3]);

            this.scale_history = 0.7;
            this.scale_timeline = 0.6;
            this.scale_crash = 0.7;
            this.scale_countdown = 0.7;
            this.isMobile = true;
        }

        this.updateHistory();
    }

    createBg(resource) {
        this.spr_bg = this.createSprite(resource.bg, gameApp.canvas_width / 2, gameApp.canvas_height / 2, 0.5, 0.5, gameApp.max_scale * 0.5);
        this.addChild(this.spr_bg);
    }

    createTimeline() {
        this.container_timeline = new PIXI.Container();
        this.container_timeline.setTransform(0.0, 0.0);

        const styleX = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 14,
            fill: '0xFAE2CA',
            lineHeight: 18,
            align: 'center'
        });

        const styleY = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 14,
            fill: '0xFFFFFF',
            lineHeight: 18,
            align: 'left'
        });

        let delta_x = (this.pos_timeline_x.x2 - this.pos_timeline_x.x1) / 5;
        let delta_y = (this.pos_timeline_y.y2 - this.pos_timeline_y.y1) / 4;

        for(let index = 0; index < 6; index++)
            this.container_timeline.addChild(this.createText(this.xAix[index], styleX, this.pos_timeline_x.x1 + delta_x * index, this.pos_timeline_x.y, 0.5, 0.5, 1.0, {tag: 'timeline_x', index: index}));

        for(let index = 0; index < 5; index++)
            this.container_timeline.addChild(this.createText(this.yAix[4 - index].toFixed(2) + 'X', styleY, this.pos_timeline_y.x, this.pos_timeline_y.y1 + delta_y * index, 0.0, 0.5, 1.0, {tag: 'timeline_y', index: index}));
        
        this.addChild(this.container_timeline);
    }

    createRocket(resource) {
        this.spr_rocket = this.createSprite(resource.rocket, this.pos_rocket.getPoint(0).x, this.pos_rocket.getPoint(0).y, 0.295, 0.555, gameApp.scale_x * 0.8 * 0.5);
        this.graphic_curve = new SmoothGraphics();
        this.addChild(this.graphic_curve);
        this.addChild(this.spr_rocket);
    }

    createHistory(resource) {
        this.texture_history = resource.history;
        this.container_history = new PIXI.Container();
        this.container_history.setTransform(0.0, 0.0);
        this.addChild(this.container_history);

        this.addHistory(null);
    }

    createCrash() {
        this.container_crash = new PIXI.Container();
        this.container_crash.setTransform(0.0, 0.0);

        const style1 = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 14,
            fill: '0x430779',
            lineHeight: 18,
            align: 'center'
        });

        const style2 = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 900,
            fontSize: 72,
            fill: '0x310961',
            lineHeight: 92,
            align: 'center',
            stroke: '#FBE1CA',
            strokeThickness: 4
        });

        this.container_crash.addChild(this.createText('ROUND OVER', style1, this.pos_crash.x, this.pos_crash.y1, 0.5, 0.5, 1.0, {tag: 'over'}));
        this.container_crash.addChild(this.createText('580.05x', style2, this.pos_crash.x, this.pos_crash.y2, 0.5, 0.5, 1.0, {tag: 'crash'}));
        this.addChild(this.container_crash);
    }

    createCountdown() {
        this.graphic_countdown = new SmoothGraphics();
        this.addChild(this.graphic_countdown);

        this.container_countdown = new PIXI.Container();
        this.container_countdown.setTransform(0.0, 0.0);

        const style = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 20,
            fill: '0xFFFFFF',
            lineHeight: 26,
            align: 'center',
        });

        this.container_countdown.addChild(this.createText('STARTING IN', style, gameApp.canvas_width / 2, gameApp.canvas_height / 2 - 20.0 * gameApp.scale_y, 0.5, 0.5, 1.0, {count: MAX_COUNTDOWN}));
        this.addChild(this.container_countdown);
    }

    createExplosion(resource) {
        const explosion_textures = [];
        for(let index = 0; index < 49; index++) {
            const texture = PIXI.Texture.from(`explosion${index+1}.png`);
            explosion_textures.push(texture);
        }

        this.spr_explosion = new PIXI.AnimatedSprite(explosion_textures);
        this.spr_explosion.setTransform(gameApp.canvas_width / 2, gameApp.canvas_height / 2);
        this.spr_explosion.anchor.set(0.43, 0.66);
        this.spr_explosion.scale.set(gameApp.scale_x * 2);
        this.spr_explosion.loop = false;
        this.addChild(this.spr_explosion);
    }

    renderBg() {
        if(this.spr_bg === null)
            return;

        this.spr_bg.setTransform(gameApp.canvas_width / 2, gameApp.canvas_height / 2);
        this.spr_bg.anchor.set(0.5);
        this.spr_bg.scale.set(gameApp.max_scale * 0.5);
    }

    renderTimeline(state) {
        if(this.container_timeline === null)
            return;

        let delta_x = (this.pos_timeline_x.x2 - this.pos_timeline_x.x1) / 5;
        let delta_y = (this.pos_timeline_y.y2 - this.pos_timeline_y.y1) / 4;
        
        this.container_timeline.children.forEach(element => {
            if(element.userData !== null && element.userData.tag === 'timeline_x')
                element.setTransform(this.pos_timeline_x.x1 + delta_x * element.userData.index, this.pos_timeline_x.y);

            if(element.userData !== null && element.userData.tag === 'timeline_y')
                element.setTransform(this.pos_timeline_y.x, this.pos_timeline_y.y1 + delta_y * element.userData.index);

            element.visible = (state !== GAME_STATE.COUNTDOWN && state !== GAME_STATE.NONE);
            element.scale.set(this.scale_timeline);
        });
    }

    renderRocket(frame, state) {
        if(this.graphic_curve === null)
            return;

        let real_frame = (frame < MAX_FLY_FRAME) ? frame : MAX_FLY_FRAME;

        this.graphic_curve.clear();
        this.spr_rocket.visible = (state === GAME_STATE.FLY);

        if(state !== GAME_STATE.FLY)
            return;

        this.graphic_curve.lineStyle(25.0 * gameApp.scale_x, 0xF9D7D4, 1);
        for(let index = 0; index < real_frame; index++) {
            let x = this.pos_rocket.getPoint(index / MAX_FLY_FRAME).x;
            let y = this.pos_rocket.getPoint(index / MAX_FLY_FRAME).y;
            if(index === 0)
                this.graphic_curve.moveTo(x, y);
            else
                this.graphic_curve.lineTo(x, y);
        }  

        let dropShadowFilter = new PIXIFilter.DropShadowFilter({
            offset: {x: 0, y: 4 * gameApp.scale_y},
            color: 0x000000,
            alpha: 0.3,
            blur: 1
        });
        this.graphic_curve.filters = [dropShadowFilter];

        let target = real_frame / MAX_FLY_FRAME;
        let target1 = (real_frame - 1) / MAX_FLY_FRAME;
        let pos = this.pos_rocket.getPoint(target);
        let pos1 = this.pos_rocket.getPoint(target1);
        this.spr_rocket.setTransform(this.pos_rocket.getPoint(target).x, this.pos_rocket.getPoint(target).y);
        this.spr_rocket.scale.set(gameApp.scale_x * 0.8 * 0.5);
        this.spr_rocket.rotation = (Math.PI / 180) - Math.atan((pos1.y - pos.y) / (pos.x - pos1.x));
    }

    renderHistory(state) {
        if(this.container_history === null)
            return;

        this.container_history.children.forEach(element => {
            if(element.userData !== null) {
                if(element.userData.tag === 'bg') {
                    element.setTransform(this.pos_history.x + 105.0 * element.userData.index * this.scale_history, this.pos_history.y);
                    element.filters[0].thickness = 2 * this.scale_history;
                }
                else if(element.userData.tag === 'history')
                    element.setTransform(this.pos_history.x + (105.0 * element.userData.index + 48.0) * this.scale_history, this.pos_history.y);
            }
            element.scale.set(this.scale_history);
        });

        this.container_history.visible = (state !== GAME_STATE.NONE);
    }

    renderCrash(state) {
        if(this.container_crash === null)
            return;

        this.container_crash.children.forEach(element => {
            if(element.userData !== null) {
                if(element.userData.tag === 'over') {
                    element.setTransform(this.pos_crash.x, this.pos_crash.y1);
                    element.visible = (state === GAME_STATE.CRASH);
                }
                else if(element.userData.tag === 'crash') {
                    element.setTransform(this.pos_crash.x, this.pos_crash.y2);
                    element.visible = (state !== GAME_STATE.COUNTDOWN && state !== GAME_STATE.NONE);
                }
                element.scale.set(this.scale_crash);
            }
        });
    }

    renderCountdown(frame, state) {
        if(this.graphic_countdown === null || this.container_countdown === null)
            return;

        let count = MAX_COUNTDOWN;
        let delta = gameApp.canvas_width >= 888 ? 0 : 50 * gameApp.scale_y;
        this.container_countdown.children.forEach(element => {
            if(element.userData !== null) {
                count = element.userData.count;
                element.setTransform(gameApp.canvas_width / 2, gameApp.canvas_height / 2 - 20.0 * this.scale_countdown - delta);
                element.scale.set(this.scale_countdown);
                element.visible = (state === GAME_STATE.COUNTDOWN);
            }
        });
        
        this.graphic_countdown.clear();

        if(state !== GAME_STATE.COUNTDOWN)
            return;

        this.graphic_countdown.lineStyle(3, 0x925BEC); //[0x5A45D1, 0xBA6AFF]
        this.graphic_countdown.beginFill(0x671F69);
        this.graphic_countdown.drawRoundedRect(gameApp.canvas_width / 2 - 163.0 * this.scale_countdown, gameApp.canvas_height / 2 - 48.5 * this.scale_countdown - delta, 326.0 * this.scale_countdown, 57.0 * this.scale_countdown, 8);
        this.graphic_countdown.endFill();

        this.graphic_countdown.beginFill(0x925BEC);
        this.graphic_countdown.drawRoundedRect(gameApp.canvas_width / 2 - 163.0 * this.scale_countdown, gameApp.canvas_height / 2 - 48.5 * this.scale_countdown - delta, 326.0 * this.scale_countdown * (count / MAX_COUNTDOWN), 57.0 * this.scale_countdown, 8);
        this.graphic_countdown.endFill();
    }

    renderExplosion(state) {
        if(this.spr_explosion === null)
            return;

        this.spr_explosion.setTransform(this.spr_rocket.position.x, this.spr_rocket.position.y);
        this.spr_explosion.visible = (state === GAME_STATE.CRASH);
        this.spr_explosion.scale.set(gameApp.scale_x * 2);

        if(state === GAME_STATE.CRASH)
            this.startExplosion();
    }

    updateCountDown(count) {
        if(this.container_countdown === null)
            return;

        this.container_countdown.children.forEach(element => {
            if(element.userData !== null) {
                element.userData.count = count;
            }
        });

        this.container_timeline.children.forEach(element => {
            if(element.userData.tag !== null) {
                if(element.userData.tag === 'timeline_y')
                    element.text = this.yAix[4 - element.userData.index].toFixed(2) + 'X';
                else if(element.userData.tag === 'timeline_x')
                    element.text = this.xAix[element.userData.index];
            }
        });
    }

    updateCrash(payout, time = null) {
        if(this.container_crash === null)
            return;

        this.container_crash.children.forEach(element => {
            if(element.userData !== null) {
                if(element.userData.tag === 'crash') {
                    element.text = parseFloat(payout).toFixed(2) + 'x';
                }
            }
        });

        this.updateTimelineY(parseFloat(payout));
        if(time !== null)
            this.updateTimelineX(time);
    }

    updateTimelineX(value) {
        if(value <= 10.0)
            return;

        if(this.container_timeline === null)
            return;

        let float_value = Math.floor(value) + 2;
        if(float_value % 2 !== 0)
            return;

        this.container_timeline.children.forEach(element => {
            if(element.userData.tag !== null && element.userData.tag === 'timeline_x') {
                element.text = float_value - 2 * (5 - element.userData.index);
            }
        });  
    }

    updateTimelineY(value) {
        if(value <= 1.4)
            return;

        if(this.container_timeline === null)
            return;

        let float_value = Number(value.toFixed(1)) + 0.1;
        
        this.container_timeline.children.forEach(element => {
            if(element.userData.tag !== null && element.userData.tag === 'timeline_y') {
                element.text = (float_value - 0.1 * element.userData.index).toFixed(2) + 'X';
            }
        });        
    }

    initHistory(history) {
        this.history = [];

        for(let index = history.length - 1; index >= 0; index--)
            this.addHistory(history[index].fairResult);
    }

    addHistory(history) {
        if(history !== null)
            this.history.push(history);

        if(this.history.length > 5)
            this.history.shift();

        this.updateHistory();
    }

    updateHistory() {
        if(this.container_history === null)
        return;

        this.container_history.removeChildren();

        const style = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 14,
            fill: '0xFFFFFF',
            lineHeight: 18,
            align: 'center'
        });

        let start = (this.isMobile && this.history.length > 3) ? this.history.length - 3 : 0;
        for(let index = start; index < this.history.length; index++) {
            let bg = this.createSprite(this.texture_history, this.pos_history.x + 105.0 * (index - start) * this.scale_history, this.pos_history.y, 0.0, 0.5, 1.0, {tag: 'bg', index: index - start});
            bg.filters = [new PIXIFilter.OutlineFilter(2, 0x7650DE)];
            this.container_history.addChild(bg);
            this.container_history.addChild(this.createText(this.history[index].toFixed(2) + 'x', style, this.pos_history.x + (101.0 * (index - start) + 48.0) * this.scale_history, this.pos_history.y, 0.5, 0.5, 1.0, {tag: 'history', index: index - start}));
        }
    }

    startExplosion() {
        if(this.explosion_started)
            return;

        gameApp.postMessage({type: 'playzelo-Crash-Sound', data: 'explosion'});

        this.explosion_started = true;
        this.spr_explosion.gotoAndPlay(0);
        this.spr_explosion.onComplete = () => {
        }
    }

    completeExplosion() {
        this.explosion_started = false;

        let crash = 0.0;
        this.container_crash.children.forEach(element => {
            if(element.userData !== null) {
                if(element.userData.tag === 'crash') {
                    crash = parseFloat(element.text);
                }
            }
        });

        this.addHistory(crash);
    }

    createCashout(frame, cashout) {
        let real_frame = (frame <= MAX_FLY_FRAME) ? frame : MAX_FLY_FRAME;
        let position = this.pos_rocket.getPoint(real_frame / MAX_FLY_FRAME);
        let container_cashout = new PIXI.Container();
        container_cashout.setTransform(0.0, 0.0);

        container_cashout.addChild(this.createSprite(this.currencyTexture(cashout.coinType.coinType), position.x, position.y, 0.5, 0.5, gameApp.scale_x));
        container_cashout.addChild(this.createSprite(this.texture_cashout, position.x - 60.0 * gameApp.scale_x, position.y - 75.0 * gameApp.scale_y, 0.5, 0.5, gameApp.scale_x));
        
        const style1 = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 17 * gameApp.scale_x,
            fill: '0xFAE2CA',
            lineHeight: 22,
            align: 'center'
        });

        const style2 = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 13 * gameApp.scale_x,
            fill: '0xB3B4B9',
            lineHeight: 17,
            align: 'center'
        });

        container_cashout.addChild(this.createText(cashout.profit.toFixed(2), style1, position.x - 60.0 * gameApp.scale_x, position.y - 93.0 * gameApp.scale_y, 0.5, 0.5, 1.0));
        container_cashout.addChild(this.createText(cashout.payout.toFixed(2) + 'x', style2, position.x - 60.0 * gameApp.scale_x, position.y - 73.0 * gameApp.scale_y, 0.5, 0.5, 1.0));
        container_cashout.alpha = 0;
        this.addChild(container_cashout);

        gsap.to(container_cashout, 
                {
                    duration: 0.5, 
                    alpha: 1.0, 
                    onComplete: () => {
                        setTimeout(() => {
                            this.removeChild(container_cashout);
                        }, 500);
                    }
                }
        );
    }

    currencyTexture(coinType) {
        switch(coinType) {
            case 'BNB':
                return this.texture_coin[0];
            case 'BTC':
                return this.texture_coin[1];
            case 'ETH':
                return this.texture_coin[2];
            case 'TRX':
                return this.texture_coin[3];
            case 'USDT':
                return this.texture_coin[4];
            case 'ZELO':
                return this.texture_coin[5];
            default:
                return null;
        }
    }
}