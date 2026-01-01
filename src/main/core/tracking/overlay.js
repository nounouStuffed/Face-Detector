import { config } from '../../../config/config.js';

export function drawBox(ctx, box) {

    if (!config.debug.tracking.faceOverlay) return;
    if (!box) return;

    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y, box.size, box.size);
}
