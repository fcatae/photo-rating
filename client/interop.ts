import * as files from './server/files.js';

// create the queue
var _queue = [];
function insertImageIntoQueue(img) {
    _queue.push(img);
}

// random images from docs.microsoft.com
// function createImageList() {
//     return [
//         'https://docs.microsoft.com/en-us/azure/iot-hub/media/iot-hub-get-started-e2e-diagram/6.png',
//         'https://docs.microsoft.com/fr-fr/azure/machine-learning/studio/media/what-is-machine-learning/machine-learning-service-parts-and-workflow.png',
//         'https://docs.microsoft.com/en-us/azure/machine-learning/team-data-science-process/media/cortana-analytics-playbook-vehicle-telemetry/fig1-vehicle-telemetry-annalytics-solution-architecture.png',
//         'https://docs.microsoft.com/en-us/visualstudio/ai/media/about/gallery.png',
//         'https://docs.microsoft.com/pt-br/azure/machine-learning/studio/media/what-is-machine-learning/machine-learning-cortana-intelligence-gallery.png',
//         'https://docs.microsoft.com/en-us/azure/machine-learning/team-data-science-process/media/cortana-analytics-playbook-predictive-maintenance/example-solution-architecture-for-predictive-maintenance.png'
//     ];
// }

import { createImageList } from './server/files.js';

// insert images into the queue
createImageList().map( insertImageIntoQueue );

// PUBLIC
export function getNextImage(): string {
    var next = _queue.shift();
    return next;
}

export function approveFile(file: string, tag: string) {
    return files.approveFile(file, tag);
}
