document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Mobile nav toggle ---------- */
    document.querySelectorAll('.navbar').forEach(function (nav) {
        var toggle = nav.querySelector('.navbar-toggle, .property-navbar-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            nav.classList.toggle('nav-open');
            var icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) {
                nav.classList.remove('nav-open');
                var icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    });

    /* ---------- Custom select dropdowns ---------- */
    document.querySelectorAll('.custom-select').forEach(function (select) {
        var trigger = select.querySelector('.custom-select-trigger');
        var valueEl = select.querySelector('.custom-select-value');
        var options = select.querySelectorAll('.custom-select-option');
        var hiddenSelect = select.querySelector('select');

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            document.querySelectorAll('.custom-select.is-open').forEach(function (open) {
                if (open !== select) open.classList.remove('is-open');
            });
            select.classList.toggle('is-open');
        });

        options.forEach(function (option) {
            option.addEventListener('click', function () {
                options.forEach(function (o) { o.classList.remove('selected'); });
                option.classList.add('selected');
                valueEl.textContent = option.textContent;
                valueEl.classList.remove('custom-select-placeholder');

                if (hiddenSelect) {
                    hiddenSelect.value = option.getAttribute('data-value');
                    hiddenSelect.dispatchEvent(new Event('change'));
                }
                select.classList.remove('is-open');
            });
        });
    });

    document.addEventListener('click', function (e) {
        document.querySelectorAll('.custom-select.is-open').forEach(function (select) {
            if (!select.contains(e.target)) {
                select.classList.remove('is-open');
            }
        });
    });

    /* ---------- Blog filters ---------- */
    var filterButtons = document.querySelectorAll('.blog-filter-btn');
    var blogCards = document.querySelectorAll('.blog-card');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');

            var category = btn.getAttribute('data-category');

            blogCards.forEach(function (card) {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.classList.remove('is-filtered-out');
                } else {
                    card.classList.add('is-filtered-out');
                }
            });
        });
    });

    /* ---------- Blog load more ---------- */
    var loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            document.querySelectorAll('.blog-card.is-hidden').forEach(function (card) {
                card.classList.remove('is-hidden');
            });
            loadMoreBtn.classList.add('is-done');
        });
    }

});
