import * as PIXI from "pixi.js";

export class BaseLayer extends PIXI.Container {

    GAME_WIDTH = 1061;
    GAME_HEIGHT = 726;

    init(resource) {
        this.sortableChildren = true;
    }

    onResize(width, height) {

    }

    createSprite(texture, x, y, anchor_x = 0, anchor_y = 0, scale = 1.0, userData = null) {
        const sprite = PIXI.Sprite.from(texture);
        sprite.setTransform(x, y);
        sprite.anchor.set(anchor_x, anchor_y);
        sprite.scale.set(scale);
        sprite.userData = userData;
        return sprite;
    }

    createText(string, style, x, y, anchor_x = 0, anchor_y = 0, alpha = 1, userData = null) {
        const text = new PIXI.Text(string, style);
        text.setTransform(x, y);
        text.anchor.set(anchor_x, anchor_y);
        text.alpha = alpha;
        text.userData = userData;
        text.resolution = 2;
        return text;
    }
}