import * as PIXI from "pixi.js";
import { FRAME_RATE, GAME_HEIGHT, GAME_STATE, GAME_WIDTH } from "./data/Constant";
import { Resource } from "./data/Resource";
import { CrashLayer } from "./layer/CrashLayer";

export class CrashApp extends PIXI.Application {

    canvas_width    = 0;
    canvas_height   = 0;
    scale_x         = 1.0;
    scale_y         = 1.0;
    max_scale       = 1.0;
    min_scale       = 1.0;

    frame_speed     = 0;
    frame_count     = 0;
    current_frame   = 0;
    speed_delta     = 0;
    state           = GAME_STATE.NONE;

    layer_crash     = null;

    started         = false;
    isFirst         = true;
    need_sound      = false;

    constructor(option) {
        super(option);
    }

    onResize(width, height) {
        if(this.canvas_width === width && this.canvas_height === height)
            return;

        this.canvas_width = width;
        this.canvas_height = height;
        this.scale_x = width / GAME_WIDTH;
        this.scale_y = height / GAME_HEIGHT;
        this.max_scale = Math.max(this.scale_x, this.scale_y);
        this.min_scale = Math.min(this.scale_x, this.scale_y);

        if(this.layer_crash !== null)
            this.layer_crash.onResize(width, height);

        this.renderer.resize(width, height);
    }

    startGame() {
        this.stage.sortableChildren = true;

        this.frame_speed = 60 / FRAME_RATE;

        this.layer_crash = new CrashLayer();
        this.stage.addChild(this.layer_crash);

        const keys = [];
        Resource.forEach(resource => {
            PIXI.Assets.add(resource.key, resource.src);
            keys.push(resource.key);
        });

        PIXI.Assets.load(keys, (progress) => {

        })
        .then((textures) => {
            this.started = true;

            if(this.layer_crash !== null)
                this.layer_crash.init(textures);
        });
    }

    destroy(bRemoveView, bStageOptions) {
        super.destroy(bRemoveView, bStageOptions);
    }

    render(delta) {
        this.speed_delta += delta;
        this.frame_count = 0;

        while(this.speed_delta >= this.frame_speed) {
            this.speed_delta -= this.frame_speed;
            this.frame_count++;
        }

        if(this.frame_count === 0)
            return;

        if(this.started)
            this.current_frame += this.frame_count;

        this.updateRender();
        super.render();
    }

    updateRender() {
        if(this.layer_crash !== null)
            this.layer_crash.updateRender(this.current_frame, this.state, this.frame_speed);
    }

    initHistory(history) {
        if(this.layer_crash !== null)
            this.layer_crash.initHistory(history);
    }

    countDown(count) {
        this.state = GAME_STATE.COUNTDOWN;
        this.isFirst = true;

        if(this.layer_crash !== null)
            this.layer_crash.updateCountDown(count);
    }

    fly(payout, time) {
        this.state = GAME_STATE.FLY;
        if(this.isFirst) {
            this.isFirst = false;
            this.current_frame = parseFloat(time) * FRAME_RATE;
        }

        if(this.need_sound) {
            this.need_sound = false;
            this.postMessage({type: 'playzelo-Crash-Sound', data: 'flying'});
        }

        if(this.layer_crash !== null)
            this.layer_crash.updateCrash(payout, time);
    }

    crash(payout) {
        this.state = GAME_STATE.CRASH;

        if(this.layer_crash !== null)
            this.layer_crash.updateCrash(payout);
    }

    complete() {
        if(this.layer_crash !== null)
            this.layer_crash.completeExplosion();
    }

    createCashout(cashout) {
        if(this.state !== GAME_STATE.FLY)
            return;

        if(this.layer_crash !== null)
            this.layer_crash.createCashout(this.current_frame, cashout);
    }

    setNeedSound(value) {
        this.need_sound = value;
    }

    postMessage(message) {
        window.postMessage(message, '*');
    }
}