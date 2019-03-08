/**
 * Utils for event handlers
 */

/**
 * Constants for keys
 * @type {{ENTER: string}}
 */
const KEYS = {
	ENTER : 'Enter'
};
/**
 * Register this callback to onKeyPress to trigger the callback, when Enter is pressed
 * @param {KeyboardEvent} event
 * @param {Function} callback Function to call when enter is pressed
 */
const onEnterKeyPressTriggerCallback =(event, callback) => {
	if(event.key && event.key === KEYS.ENTER) {
		event.preventDefault();
		callback(event);
	}
	return event;
};

export {
	onEnterKeyPressTriggerCallback
}