document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const items = Array.from(carousel.children); // Ensure we have an array of items

    function slideCarouselRight() {
        const firstItem = carousel.firstElementChild;
        carousel.appendChild(firstItem.cloneNode(true)); // Clone and append to end
        firstItem.remove(); // Remove the first item
        updateCarouselDisplay(); // Update any necessary display properties
    }

    function slideCarouselLeft() {
        const lastItem = carousel.lastElementChild;
        carousel.prepend(lastItem.cloneNode(true)); // Clone and prepend to start
        lastItem.remove(); // Remove the last item
        updateCarouselDisplay(); // Update any necessary display properties
    }

    function updateCarouselDisplay() {
        items.forEach(item => {
            item.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            item.style.transform = 'translateX(0%)'; // Reset any transforms if needed
        });
    }

    // Example event handlers for arrow clicks
    document.querySelector('.carousel_arrow_container.left img').addEventListener('click', slideCarouselLeft);
    document.querySelector('.carousel_arrow_container.right img').addEventListener('click', slideCarouselRight);

    // Optional: Mouse event handlers for swipe functionality
    let clientXpushed = 0;

    carousel.addEventListener('mousedown', function (e) {
        clientXpushed = e.clientX;
    });

    carousel.addEventListener('mouseup', function (e) {
        let clientXreleased = e.clientX;
        if (clientXpushed - clientXreleased > 0) {
            slideCarouselRight();
        } else if (clientXpushed - clientXreleased < 0) {
            slideCarouselLeft();
        }
    });
});
