import * as PIXI from "pixi.js";
import { Resource } from "./data/Resource";
import { SlotLayer } from "./layer/SlotLayer";
import SlotSocketManager from "./utils/SlotSocketManager";

export class SlotApp extends PIXI.Application {

    FRAME_RATE      = 30;

    canvas_width    = 0;
    canvas_height   = 0;

    layer_slot      = null;

    frame_speed     = 0;
    frame_count     = 0;
    speed_delta     = 0;

    authData        = null;
    currency        = null;
    betAmount       = 0;
    betLines        = 0;
    autoCount       = 0;

    started         = false;

    constructor(option) {
        super(option);
    }

    onResize(width, height) {
        if(this.canvas_width === width && this.canvas_height === height)
            return;

        this.canvas_width = width;
        this.canvas_height = height;

        if(this.layer_slot !== null)
            this.layer_slot.onResize(width, height);

        this.renderer.resize(width, height);
    }

    startGame() {
        this.frame_speed = 60 / this.FRAME_RATE;

        this.layer_slot = new SlotLayer();
        this.stage.addChild(this.layer_slot);

        const keys = [];
        Resource.forEach(resource => {
            PIXI.Assets.add(resource.key, resource.src);
            keys.push(resource.key);
        });

        PIXI.Assets.load(keys, (progress) => {

        })
        .then((textures) => {
            this.started = true;

            if(this.layer_slot !== null)
                this.layer_slot.init(textures);

            this.ticker.add((delta) => {
                if(this.layer_slot !== null)
                    this.layer_slot.updateAnimation();
            });

            this.ticker.add((delta) => {
                if(this.layer_slot !== null)
                    this.layer_slot.updateTweening();
            });
        });
    }

    destroy(bRemoveView, bStageOptions) {
        super.destroy(bRemoveView, bStageOptions);
    }

    bet() {
        if(this.authData === null || !this.authData.isAuth) 
            return;

        if(this.autoCount < 0) {
            if(this.layer_slot !== null)
                this.layer_slot.running = false;
            return;
        }

        this.updateLoading(true);

        this.autoCount--;

        const request = {
            userId: this.authData.userData._id,
            betAmount: this.betAmount,
            lines: this.betLines,
            coinType: this.currency
        }

        SlotSocketManager.getInstance().joinBet(request);
    }

    showResult(roundData, rewardData) {
        if(this.layer_slot !== null)
            this.layer_slot.showResult(roundData, rewardData);
    }

    updateCurrency(currency) {
        this.currency = currency;
    }

    updateBetAmount(betAmount) {
        this.betAmount = betAmount;
    }

    updateBetLines(lines) {
        this.betLines = lines;
    }

    updateAutoCount(autoCount) {
        this.autoCount = autoCount;
    }

    updateAuthData(authData) {
        this.authData = authData;
    }

    updateGameState() {
        this.postMessage({type: 'playzelo-Slot-UpdateGameState', data: ''});
    }

    updateLoading(flag) {
        this.postMessage({type: 'playzelo-Slot-UpdateLoading', data: flag});
    }

    postMessage(message) {
        window.postMessage(message, '*');
    }

    // render(delta) {
    //     if(!this.started)
    //         return;

    //     this.speed_delta += delta;
    //     this.frame_count = 0;

    //     while(this.speed_delta >= this.frame_speed) {
    //         this.speed_delta -= this.frame_speed;
    //         this.frame_count++;
    //     }

    //     if(this.frame_count === 0)
    //         return;

    //     super.render();
    // }
}