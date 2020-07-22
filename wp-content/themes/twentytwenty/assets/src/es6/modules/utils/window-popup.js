/**
 * Social Sharer popup window
 * @param url
 * @param width
 * @param height
 */
export default function (url, width, height) {
    // Calculate the position of the popup so
    // it’s centered on the screen.
    const left = (screen.width / 2) - (width / 2), top = (screen.height / 2) - (height / 2);
    window.open(url, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
};
