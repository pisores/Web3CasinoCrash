import * as PIXI from "pixi.js";
import { gameApp } from "../index";
const { BaseLayer } = require("./BaseLayer");
const { PATTERN_RULE } = require('../data/Constant');

export class SlotLayer extends BaseLayer {

    REEL_COUNT          = 5;
    REEL_WIDTH          = 134.0;
    REEL_HEIGHT         = 444.0;
    REEL_OFFSET_X       = 143.0;
    REEL_OFFSET_Y       = 148.0;

    SYMBOL_COUNT        = 11;
    SYMBOL_WIDTH        = 112.0;
    SYMBOL_HEIGHT       = 118.0;

    MOVE_SYMBOLS        = 30;

    slot_textures       = null;
    coin_textures       = null;

    spr_platform        = null;
    spr_logo            = null;
    graphic_line        = null;
    container_total     = null;
    container_rule      = null;
    container_result    = null;
    container_freespin  = null;
    container_reel      = null;

    reels               = [];
    targets             = [0, 0, 0, 0, 0];
    tweening            = [];
    results             = null;
    rewards             = null;

    running             = false;
    freespin_mode       = false;
    freespin_count      = 0;

    reward_index        = 0;
    total_payout        = 0;
    round_payout        = 0;

    init(resource) {
        super.init(resource);

        this.coin_textures = [
            resource.coin_bnb,
            resource.coin_btc,
            resource.coin_eth,
            resource.coin_trx,
            resource.coin_usdt,
            resource.coin_zelo
        ];

        this.spr_platform = this.addChild(this.createSprite(resource.platform, this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + 31.0, 0.5, 0.5));
        this.spr_logo = this.addChild(this.createSprite(resource.logo, this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 - 275.5, 0.5, 0.5));

        this.createSlot(resource);
        this.createGraphic();
        this.createTotalPayout(resource);
        this.createRulePayout(resource);
        this.createResult(resource);
        this.createFreeSpin(resource);
        this.updateMask();
    }

    onResize(width, height) {
        // const scale_x = width / this.GAME_WIDTH;
        const scale_y = height / this.GAME_HEIGHT;
        // const scale = Math.min(scale_x, scale_y);
        const scale = scale_y;
        
        this.scale.set(scale);
        this.x = (width - this.GAME_WIDTH * scale) / 2;
        this.y = (height - this.GAME_HEIGHT * scale) / 2;

        this.updateMask();
    }

    updateTweening() {
        const now = Date.now();
        const remove = [];
        
        for(let i = 0; i < this.tweening.length; i++) {
            const t = this.tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);
            t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase)); 

            if(t.change)
                t.change(t);
            
            if(phase === 1) {
                t.object[t.property] = t.target;
                if(t.complete)
                    t.complete(t);
                remove.push(t);
            }
        }

        for(let i = 0; i < remove.length; i++) 
            this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
    }

    updateAnimation() {
        for(let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            r.blur.blurY = (r.position - r.prevPosition) * 30;
            r.prevPosition = r.position;

            for(let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = (((r.position + j) % r.symbols.length) - 0.5) * this.REEL_OFFSET_Y;
                if(s.y < 0 && prevy > this.REEL_OFFSET_Y) {
                    if(Math.floor(r.position) >= (this.targets[i] - 3) && Math.floor(r.position) < this.targets[i]) {
                        let result = this.getResult();
                        let symbol_index = result[this.targets[i] - Math.floor(r.position) - 1][i];
                        s.texture = this.slot_textures[symbol_index];
                    }
                    else {
                        if(this.freespin_mode)
                            s.texture = this.slot_textures[Math.floor(Math.random() * this.slot_textures.length - 1)];
                        else
                            s.texture = this.slot_textures[Math.floor(Math.random() * this.slot_textures.length)];
                    }
                        
                    s.x = this.REEL_WIDTH / 2;
                    s.anchor.set(0.5, 0.5);
                }
            }
        }
    }

    createSlot(resource) {
        this.slot_textures = [
            resource.slot_1,
            resource.slot_2,
            resource.slot_3,
            resource.slot_4,
            resource.slot_5,
            resource.slot_6,
            resource.slot_7,
            resource.slot_8,
            resource.slot_9,
            resource.slot_wild,
            resource.slot_scatter
        ];

        this.container_reel = new PIXI.Container();

        for(let i = 0; i < this.REEL_COUNT; i++) {
            const rc = new PIXI.Container();
            rc.x = this.GAME_WIDTH / 2 - 351.5 + i * this.REEL_OFFSET_X;
            rc.y = this.GAME_HEIGHT / 2 - 163.0;
            this.container_reel.addChild(rc);

            const reel = {
                container: rc,
                symbols: [],
                position: 0,
                prevPosition: 0,
                blur: new PIXI.filters.BlurFilter()
            };
            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];

            for(let j = 0; j < 4; j++) {
                const symbol = this.createSprite(this.slot_textures[Math.floor(Math.random() * this.slot_textures.length)],
                                                    this.REEL_WIDTH / 2, (j - 0.5) * this.REEL_OFFSET_Y, 0.5, 0.5, 0.5);
                reel.symbols.push(symbol);
                rc.addChild(symbol);
            }
            this.reels.push(reel);
        }

        this.addChild(this.container_reel);
    }

    createGraphic() {
        this.graphic_line = new PIXI.Graphics();
        this.addChild(this.graphic_line);
    }

    createTotalPayout(resource) {
        this.container_total = new PIXI.Container();
        this.container_total.setTransform(this.GAME_WIDTH / 2 - 159.0, this.GAME_HEIGHT / 2 - 183.0 - 21.0);

        this.container_total.addChild(this.createSprite(resource.bg_total, 0, 0, 0.0, 0.0, 1.0, {tag: 'bg'}));

        const style = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 14,
            fill: '0xFFFFFF',
            lineHeight: 18,
            align: 'center'
        });
        this.container_total.addChild(this.createText('TOTAL PAYOUT 0.00000000', style, 143.0, 21.0, 0.5, 0.5, 1.0, {tag: 'text'}));
        this.container_total.addChild(this.createSprite(this.currencyTexture(), 271.0, 21.0, 0.5, 0.5, 1.0, {tag: 'coin'}));
        this.addChild(this.container_total);
    }

    createRulePayout(resource) {
        this.container_rule = new PIXI.Container();
        this.container_rule.setTransform(this.GAME_WIDTH / 2 - 120.5, this.GAME_HEIGHT / 2 + 250.0 - 24.5);

        this.container_rule.addChild(this.createSprite(resource.bg_rule, 0, 0, 0.0, 0.0, 1.0, {tag: 'bg'}));

        const style = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 18,
            fill: '0xFFFFFF',
            lineHeight: 23,
            align: 'center'
        });
        this.container_rule.addChild(this.createText('0.00000000', style, 105.0, 24.5, 0.5, 0.5, 1.0, {tag: 'text'}));
        this.container_rule.addChild(this.createSprite(this.currencyTexture(), 184.0, 24.5, 0.5, 0.5, 1.0, {tag: 'coin'}));
        this.container_rule.visible = false;
        this.addChild(this.container_rule);
    }

    createResult(resource) {
        this.container_result = new PIXI.Container();
        this.container_result.setTransform(this.GAME_WIDTH / 2 - 120.5, this.GAME_HEIGHT / 2 + 57.0 - 87.0);

        this.container_result.addChild(this.createSprite(resource.bg_result, 0, 0, 0.0, 0.0, 1.0, {tag: 'bg'}));

        const style = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 800,
            fontSize: 36,
            fill: '0xFFFFFF',
            lineHeight: 44,
            align: 'center'
        });
        this.container_result.addChild(this.createText('0.06X', style, 120.5, 60.0, 0.5, 0.5, 1.0, {tag: 'multiplier'}));

        const style1 = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 18,
            fill: '0xFFFFFF',
            lineHeight: 23,
            align: 'center'
        });
        this.container_result.addChild(this.createText('0.00000000', style1, 105.0, 120.0, 0.5, 0.5, 1.0, {tag: 'payout'}));
        this.container_result.addChild(this.createSprite(this.currencyTexture(), 184.0, 120.0, 0.5, 0.5, 1.0, {tag: 'coin'}));
        this.container_result.visible = false;
        this.addChild(this.container_result);
    }

    createFreeSpin(resource) {
        this.container_freespin = new PIXI.Container();
        this.container_freespin.setTransform(this.GAME_WIDTH / 2 - 183.5, this.GAME_HEIGHT / 2 + 57.0 - 72.5);

        this.container_freespin.addChild(this.createSprite(resource.free_spin, 0, 0, 0.0, 0.0, 1.0, {tag: 'bg'}));

        const style = new PIXI.TextStyle({
            fontFamily: 'Styrene A Web',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: 24,
            fill: '0xFFFFFF',
            lineHeight: 44,
            align: 'center'
        });
        this.container_freespin.addChild(this.createText('5 FREE SPINS', style, 183.5, 43.0, 0.5, 0.5, 1.0, {tag: 'multiplier'}));
        this.container_freespin.visible = false;
        this.addChild(this.container_freespin);
    }

    updateMask() {
        if(this.container_reel === null)
            return;

        const mask = new PIXI.Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(this.x + 179.0 * this.scale.x, this.y + 203.0 * this.scale.y, 706.0 * this.scale.x, 440.0 * this.scale.y);
        this.container_reel.mask = mask;
        mask.endFill();
    }

    drawLine(pattern) {
        this.graphic_line.clear();
        this.graphic_line.lineStyle(3, 0xFFFFFF, 1);
        for(let index = 0; index < PATTERN_RULE[pattern].length; index++) {
            if(index === 0) 
                this.graphic_line.moveTo(this.GAME_WIDTH / 2 - 351.5 + PATTERN_RULE[pattern][index][1] * this.REEL_OFFSET_X + this.REEL_WIDTH / 2,
                                            this.GAME_HEIGHT / 2 - 163.0 + (PATTERN_RULE[pattern][index][0] + 0.5) * this.REEL_OFFSET_Y );
            else
                this.graphic_line.lineTo(this.GAME_WIDTH / 2 - 351.5 + PATTERN_RULE[pattern][index][1] * this.REEL_OFFSET_X + this.REEL_WIDTH / 2,
                                            this.GAME_HEIGHT / 2 - 163.0 + (PATTERN_RULE[pattern][index][0] + 0.5) * this.REEL_OFFSET_Y );
        }
    }

    drawLines() {
        this.graphic_line.clear();
        this.graphic_line.lineStyle(3, 0xFFFFFF, 1);
        for(let i = 0; i < this.rewards.length; i++) {
            let pattern = this.rewards[i][2];

            for(let index = 0; index < PATTERN_RULE[pattern].length; index++) {
                if(index === 0) 
                    this.graphic_line.moveTo(this.GAME_WIDTH / 2 - 351.5 + PATTERN_RULE[pattern][index][1] * this.REEL_OFFSET_X + this.REEL_WIDTH / 2,
                                                this.GAME_HEIGHT / 2 - 163.0 + (PATTERN_RULE[pattern][index][0] + 0.5) * this.REEL_OFFSET_Y );
                else
                    this.graphic_line.lineTo(this.GAME_WIDTH / 2 - 351.5 + PATTERN_RULE[pattern][index][1] * this.REEL_OFFSET_X + this.REEL_WIDTH / 2,
                                                this.GAME_HEIGHT / 2 - 163.0 + (PATTERN_RULE[pattern][index][0] + 0.5) * this.REEL_OFFSET_Y );
            }
        }
    }

    clearLine() {
        this.graphic_line.clear();
    }

    tweenTo(object, property, target, time, easing, onChange, onComplete) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onChange,
            complete: onComplete,
            start: Date.now()
        };

        this.tweening.push(tween);
        return tween;
    }

    backout(amount) {
        return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
    }

    lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }    

    currencyTexture() {
        switch(gameApp.currency.coinType) {
            case 'BNB':
                return this.coin_textures[0];
            case 'BTC':
                return this.coin_textures[1];
            case 'ETH':
                return this.coin_textures[2];
            case 'TRX':
                return this.coin_textures[3];
            case 'USDT':
                return this.coin_textures[4];
            case 'ZELO':
                return this.coin_textures[5];
            default:
                return null;
        }
    }

    getResult() {
        return this.freespin_mode ? this.rewards[0][3][this.freespin_count - 1].freeFairResult : this.results;
    }

    getRewards() {
        return this.freespin_mode ? this.rewards[0][3][this.freespin_count - 1].freeRewardData : this.rewards;
    }

    showResult(results, rewards) {
        this.results = results;
        this.rewards = rewards;

        this.startPlay();
        gameApp.postMessage({type: 'playzelo-Slot-Sound', data: 'reel'});
    }

    startPlay() {
        this.running = true;
        
        this.clearLine();
        this.showRoundPayout(false);

        for(let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            this.targets[i] = r.position + this.MOVE_SYMBOLS + i * 5;
            const time = 1200 + i * 200;
            this.tweenTo(r, 'position', this.targets[i], time, this.backout(0.4), null, i === this.reels.length - 1 ? this.reelsComplete : null);
        }
    }

    reelsComplete() {
        let self = this.object.container.parent.parent;
        let rewards = self.getRewards();

        if(rewards.length === 0) {
            if(self.freespin_mode)
                self.startFreeSpin();
            
            if(!self.freespin_mode) {
                if(gameApp.autoCount < 0) {
                    if(self.round_payout > 0) {
                        self.showRoundPayout(true);
                        gameApp.postMessage({type: 'playzelo-Slot-Sound', data: 'win'});
                    }
                    gameApp.updateLoading(false);
                    self.round_payout = 0;
                }

                gameApp.updateGameState();
                gameApp.bet();
            }
        }
        else {
            self.reward_index = 0;
            if(!self.freespin_mode && self.isFreeSpin()) {
                self.showFreespin();
                self.freespin_mode = true;
            }
            else {
                self.showReward();
            }
        }
    }

    showReward() {
        let rewards = this.getRewards();

        this.total_payout += rewards[this.reward_index][0];
        this.round_payout += rewards[this.reward_index][0];

        this.drawLine(rewards[this.reward_index][2]);
        this.showRule(true);
        this.showRulePayout(true);
        this.showTotalPayout();

        gameApp.postMessage({type: 'playzelo-Slot-Sound', data: 'match'});

        setTimeout(() => {
            this.reward_index++;
            if(this.reward_index >= rewards.length) {
                this.showRule(false);
                this.showRulePayout(false);
                if(this.freespin_mode)
                    this.startFreeSpin();
                
                if(!this.freespin_mode) {
                    if(gameApp.autoCount < 0) {
                        this.drawLines();
                        this.showRoundPayout(true);
                        gameApp.postMessage({type: 'playzelo-Slot-Sound', data: 'win'});
                        gameApp.updateLoading(false);
                        this.round_payout = 0;
                    }
                    gameApp.updateGameState();
                    gameApp.bet();
                }
            }
            else
                this.showReward();
        }, 1500);
    }

    showRule(bShow) {
        let alpha = bShow ? 0.5 : 1.0;

        for(let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];

            for(let j = 0; j < r.symbols.length; j++)
                r.symbols[j].alpha = alpha;
        }

        if(!bShow)
            return;

        let reward = this.getRewards()[this.reward_index][1];
        for(let i = 0; i < reward.length; i++) {
            let reel_index = reward[i][0];
            let symbol_index = reward[i][1];

            for(let j = 0; j < this.reels[reel_index].symbols.length; j++) {
                let symbol = this.reels[reel_index].symbols[j];
                if(Math.floor(symbol.y) === (symbol_index + 0.5) * this.REEL_OFFSET_Y)
                    symbol.alpha = 1.0;
            }
        }
    }

    showRulePayout(visible) {
        this.container_rule.visible = visible;

        if(!visible)
            return;

        let rewards = this.getRewards();
        this.container_rule.y = this.GAME_HEIGHT / 2 - 163.0 + (PATTERN_RULE[rewards[this.reward_index][2]][2][0] + 0.5) * this.REEL_OFFSET_Y - 24.5;

        let text_value = rewards[this.reward_index][0].toFixed(8);
        this.container_rule.children.forEach(element => {
            if(element.userData !== null && element.userData.tag === 'text')
                element.text = text_value;
        });
    }

    showRoundPayout(visible) {
        this.container_result.visible = visible;
        
        if(!visible)
            return;

        let text_multiplier = this.round_payout.toFixed(2) + 'X';
        let text_value = this.round_payout.toFixed(8);
        this.container_result.children.forEach(element => {
            if(element.userData !== null)
            {
                if(element.userData.tag === 'multiplier')
                    element.text = text_multiplier;
                else if(element.userData.tag === 'payout')
                    element.text = text_value;
            }
        });
    }

    showTotalPayout() {
        let text_total = "TOTAL PAYOUT " + this.total_payout.toFixed(8);
        this.container_total.children.forEach(element => {
            if(element.userData !== null && element.userData.tag === 'text')
                element.text = text_total;
        });
    }

    isFreeSpin() {
        return this.rewards[0][0] === 'freespin';
    }

    showFreespin() {
        this.drawLine(this.rewards[0][2]);
        this.showRule(true);
        this.container_freespin.visible = true;

        setTimeout(() => {
            this.freespin_count = 0;
            this.hideFreespin();
            this.showRule(false);
            this.startFreeSpin();
        }, 2000);
    }

    hideFreespin() {
        this.container_freespin.visible = false;
    }

    startFreeSpin() {
        this.freespin_count++;
        if(this.freespin_count > this.rewards[0][3].length) {
            this.freespin_count = 0;
            this.freespin_mode = false;
            return;
        }

        this.startPlay();
    }
}