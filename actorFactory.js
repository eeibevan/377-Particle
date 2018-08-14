/**
 * Prototype For Abstracting Actor Creation
 * Body Appended By Each Actor File
 *
 * @param [sounds]
 * @default undefined
 * Sounds For Each Actor. If undefined, then no sounds play.
 *
 * @constructor
 */
function ActorFactory(sounds) {
    this.sounds = sounds || undefined;
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = ActorFactory;
