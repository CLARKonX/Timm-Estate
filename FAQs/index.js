/* =========================================================
   TimmEstate — shared script (used across all pages)
   1. Mobile navbar toggle
   2. Generic custom dropdown (any element with class "custom-select")
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

    /* ============ PART 1b: heart buttons shouldn't navigate a card link ============ */

    document.querySelectorAll('.archive-card-heart').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var icon = this.querySelector('i');
            var nowActive = this.classList.toggle('archive-card-heart--active');
            icon.className = nowActive ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        });
    });

    /* ============ PART 2: Generic custom dropdown ============
       Works on ANY dropdown built with this markup:

       <div class="custom-select" id="optionalId">
           <select class="select-native" tabindex="-1" aria-hidden="true">
               <option selected>Default Label</option>
               <option>Option 2</option>
           </select>
           <button type="button" class="select-trigger" aria-haspopup="listbox" aria-expanded="false">
               <span class="select-trigger-label">Default Label</span>
               <i class="fa-solid fa-chevron-down"></i>
           </button>
           <ul class="select-options" role="listbox">
               <li class="select-option select-option--active" role="option" aria-selected="true" data-value="Default Label">
                   Default Label <i class="fa-solid fa-check select-option-check"></i>
               </li>
               <li class="select-option" role="option" aria-selected="false" data-value="Option 2">
                   Option 2 <i class="fa-solid fa-check select-option-check"></i>
               </li>
           </ul>
       </div>

       No extra JS needed per dropdown — just give it the class "custom-select"
       and it's wired up automatically, and the hidden <select> stays in sync
       so any existing code listening for that select's 'change' event
       (e.g. the sort/pagination logic below) keeps working unchanged.
    ============================================================ */

    document.querySelectorAll('.custom-select').forEach(function (wrapper) {
        var nativeSelect  = wrapper.querySelector('.select-native');
        var trigger       = wrapper.querySelector('.select-trigger');
        var triggerLabel  = wrapper.querySelector('.select-trigger-label');
        var options       = wrapper.querySelectorAll('.select-option');

        if (!nativeSelect || !trigger || !options.length) return; /* malformed — skip safely */

        function closeDropdown() {
            wrapper.classList.remove('select-open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        function openDropdown() {
            /* close any other open dropdown first */
            document.querySelectorAll('.custom-select.select-open').forEach(function (w) {
                if (w !== wrapper) {
                    w.classList.remove('select-open');
                    var t = w.querySelector('.select-trigger');
                    if (t) t.setAttribute('aria-expanded', 'false');
                }
            });
            wrapper.classList.add('select-open');
            trigger.setAttribute('aria-expanded', 'true');
        }

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            wrapper.classList.contains('select-open') ? closeDropdown() : openDropdown();
        });

        options.forEach(function (option) {
            option.addEventListener('click', function () {
                var value = this.dataset.value;

                options.forEach(function (o) {
                    o.classList.remove('select-option--active');
                    o.setAttribute('aria-selected', 'false');
                });
                this.classList.add('select-option--active');
                this.setAttribute('aria-selected', 'true');
                if (triggerLabel) {
                    triggerLabel.textContent = value;
                    triggerLabel.classList.remove('select-trigger-label--placeholder');
                }

                nativeSelect.value = value;
                nativeSelect.dispatchEvent(new Event('change'));

                closeDropdown();
            });
        });

        document.addEventListener('click', function (e) {
            if (!wrapper.contains(e.target)) closeDropdown();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeDropdown();
        });
    });

    /* ============ PART 4: FAQ accordion (FAQ page only) ============ */

    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = this.closest('.faq-item');
            if (!item) return;
            var wasOpen = item.classList.contains('faq-item--open');
            /* close any other open item in the same category so only one is open at a time */
            var category = item.closest('.faq-category');
            if (category) {
                category.querySelectorAll('.faq-item--open').forEach(function (openItem) {
                    if (openItem !== item) openItem.classList.remove('faq-item--open');
                });
            }
            item.classList.toggle('faq-item--open', !wasOpen);
        });
    });

    /* ============ PART 5: Pagination + sorting (listing page) ============ */

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