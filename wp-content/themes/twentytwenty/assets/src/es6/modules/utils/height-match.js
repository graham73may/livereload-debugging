export default function heightMatch (container, item) {
    "use strict";

    container.each(function () {
        let tallestItem = 0;

        $(this).find(item).each(function () {
            const height = $(this).height();

            if (height > tallestItem) {
                tallestItem = height;
            }
        }).height(tallestItem);
    });
}
