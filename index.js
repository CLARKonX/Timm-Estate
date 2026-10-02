document.addEventListener('DOMContentLoaded', function () {

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

});