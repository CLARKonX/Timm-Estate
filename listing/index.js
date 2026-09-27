/* =========================================================
   TimmEstate — shared script (works on home + listing pages)
   1. Mobile navbar toggle (both pages)
   2. Custom "Sort by" dropdown (listing page only)
   3. Pagination + sorting (listing page only)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* ============ PART 1: Mobile navbar toggle ============ */

    const toggles = document.querySelectorAll('.navbar-toggle, .property-navbar-toggle');

    function closeAllMenus() {
        document.querySelectorAll('.navbar.nav-open, .property-navbar.nav-open').forEach(nav => {
            nav.classList.remove('nav-open');
            const icon = nav.querySelector('.navbar-toggle i, .property-navbar-toggle i');
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    }

    toggles.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const nav = this.closest('.navbar, .property-navbar');
            const opening = !nav.classList.contains('nav-open');
            closeAllMenus();
            nav.classList.toggle('nav-open', opening);
            const icon = this.querySelector('i');
            icon.className = opening ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
    });

    document.querySelectorAll('.navbar-menu a, .property-navbar-menu a, .navbar-cta, .property-navbar-cta').forEach(function (link) {
        link.addEventListener('click', closeAllMenus);
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.navbar-container, .property-navbar-container')) closeAllMenus();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllMenus();
    });

    /* ============ PART 1b: heart buttons shouldn't navigate the card link ============ */

    document.querySelectorAll('.archive-card-heart').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var icon = this.querySelector('i');
            var nowActive = this.classList.toggle('archive-card-heart--active');
            icon.className = nowActive ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        });
    });

    /* ============ PART 2: Custom "Sort by" dropdown ============ */

    var sortWrapper = document.getElementById('sortWrapper');

    if (sortWrapper) {
        var nativeSelect = sortWrapper.querySelector('.select-native');
        var trigger       = sortWrapper.querySelector('.select-trigger');
        var triggerLabel  = sortWrapper.querySelector('.select-trigger-label');
        var options       = sortWrapper.querySelectorAll('.select-option');

        function closeDropdown() {
            sortWrapper.classList.remove('select-open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        function openDropdown() {
            sortWrapper.classList.add('select-open');
            trigger.setAttribute('aria-expanded', 'true');
        }

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            sortWrapper.classList.contains('select-open') ? closeDropdown() : openDropdown();
        });

        options.forEach(function (option) {
            option.addEventListener('click', function () {
                var value = this.dataset.value;

                /* update visual state */
                options.forEach(function (o) {
                    o.classList.remove('select-option--active');
                    o.setAttribute('aria-selected', 'false');
                });
                this.classList.add('select-option--active');
                this.setAttribute('aria-selected', 'true');
                triggerLabel.textContent = value;

                /* sync hidden native select + fire change so sort logic below runs */
                nativeSelect.value = value;
                nativeSelect.dispatchEvent(new Event('change'));

                closeDropdown();
            });
        });

        document.addEventListener('click', function (e) {
            if (!sortWrapper.contains(e.target)) closeDropdown();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeDropdown();
        });
    }

    /* ============ PART 3: Pagination + sorting (listing page) ============ */

    var CARDS_PER_PAGE = 8;

    var grid       = document.querySelector('.listings-archive-grid');
    var sortSelect = document.getElementById('sort');
    var pagination = document.querySelector('.listings-pagination');

    if (!grid || !sortSelect || !pagination) return; /* not on listing page — stop here */

    var allCards = Array.prototype.slice.call(grid.querySelectorAll('.archive-card'));
    allCards.forEach(function (card, i) {
        card.dataset.originalIndex = i;
    });

    function getPrice(card) {
        var text = card.querySelector('.archive-card-price').textContent;
        return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    }

    var currentPage = 1;

    function sortCards(cards, mode) {
        var sorted = cards.slice();
        if (mode === 'Price: Low to High') {
            sorted.sort(function (a, b) { return getPrice(a) - getPrice(b); });
        } else if (mode === 'Price: High to Low') {
            sorted.sort(function (a, b) { return getPrice(b) - getPrice(a); });
        } else {
            /* Newest Listed / Most Popular → original order */
            sorted.sort(function (a, b) {
                return a.dataset.originalIndex - b.dataset.originalIndex;
            });
        }
        return sorted;
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = '';

        function addArrow(direction) {
            var btn = document.createElement('button');
            btn.className = 'pagination-arrow';
            btn.setAttribute('aria-label', direction === -1 ? 'Previous page' : 'Next page');
            btn.innerHTML = direction === -1
                ? '<i class="fa-solid fa-chevron-left"></i>'
                : '<i class="fa-solid fa-chevron-right"></i>';
            btn.dataset.page = currentPage + direction;
            if ((direction === -1 && currentPage === 1) ||
                (direction === 1 && currentPage === totalPages)) {
                btn.style.opacity = '0.35';
                btn.style.pointerEvents = 'none';
            }
            pagination.appendChild(btn);
        }

        function addPage(page) {
            var btn = document.createElement('button');
            btn.className = 'pagination-btn' + (page === currentPage ? ' pagination-btn--active' : '');
            btn.textContent = page;
            btn.dataset.page = page;
            pagination.appendChild(btn);
        }

        function addEllipsis() {
            var span = document.createElement('span');
            span.className = 'pagination-ellipsis';
            span.textContent = '...';
            pagination.appendChild(span);
        }

        addArrow(-1);

        var pagesToShow = {};
        pagesToShow[1] = true;
        pagesToShow[totalPages] = true;
        for (var p = currentPage - 1; p <= currentPage + 1; p++) {
            if (p > 1 && p < totalPages) pagesToShow[p] = true;
        }
        var sortedPages = Object.keys(pagesToShow).map(Number).sort(function (a, b) { return a - b; });

        var prev = 0;
        sortedPages.forEach(function (p) {
            if (p - prev > 1) addEllipsis();
            addPage(p);
            prev = p;
        });

        addArrow(1);
    }

    function render() {
        var sorted = sortCards(allCards, sortSelect.value);
        sorted.forEach(function (card) { grid.appendChild(card); });

        var totalPages = Math.max(1, Math.ceil(sorted.length / CARDS_PER_PAGE));
        currentPage = Math.min(currentPage, totalPages);

        sorted.forEach(function (card, i) {
            var onPage = i >= (currentPage - 1) * CARDS_PER_PAGE && i < currentPage * CARDS_PER_PAGE;
            card.style.display = onPage ? '' : 'none';
        });

        renderPagination(totalPages);
    }

    sortSelect.addEventListener('change', function () {
        currentPage = 1;
        render();
    });

    pagination.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-page]');
        if (!btn) return;
        currentPage = parseInt(btn.dataset.page, 10);
        render();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    render();
});


