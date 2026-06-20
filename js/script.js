document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // Remove hash from URL
    // -----------------------------
    document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', () => {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    });

    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // -----------------------------
    // Smooth scrolling
    // -----------------------------
    document.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', window.location.pathname);
            }
        });
    });

    // -----------------------------
    // Navbar collapse
    // -----------------------------
    const navLinks = document.querySelectorAll('#navMenu .nav-link');
    const navbarCollapse = document.getElementById('navMenu');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    new bootstrap.ScrollSpy(document.body, {
        target: '#navMenu',
        offset: 100
    });

    AOS.init();

    // -----------------------------
    // Contact Form
    // -----------------------------
    const leadForm = document.getElementById("leadForm");

    leadForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const service = document.getElementById("service").value.trim();

        if (!name || !phone) {
            alert("Please enter Name and Phone Number.");
            return;
        }

        const msg =
            `Hello Raj Investments,\n\nI am ${name}\nPhone: ${phone}\nInterested in: ${service}\n\nPlease guide me.`;

        window.open(
            "https://wa.me/919980023402?text=" + encodeURIComponent(msg),
            "_blank"
        );

        this.reset();
    });

    // -----------------------------
    // SIP Calculator
    // -----------------------------
    const sipBtn = document.getElementById("sipBtn");
    const lumpBtn = document.getElementById("lumpBtn");
    const sipInputs = document.getElementById("sipInputs");
    const lumpInputs = document.getElementById("lumpInputs");

    const sipAmount = document.getElementById("sipAmount");
    const sipAmountInput = document.getElementById("sipAmountInput");

    const lumpAmount = document.getElementById("lumpAmount");
    const lumpAmountInput = document.getElementById("lumpAmountInput");

    const rate = document.getElementById("rate");
    const rateInput = document.getElementById("rateInput");

    const years = document.getElementById("years");
    const yearsInput = document.getElementById("yearsInput");

    const investedEl = document.getElementById("invested");
    const returnsEl = document.getElementById("returns");
    const totalEl = document.getElementById("total");

    let mode = "sip";

    const format = value =>
        new Intl.NumberFormat('en-IN').format(Math.round(value));

    function sync(range, input, callback) {
        range.addEventListener("input", () => {
            input.value = range.value;
            callback();
        });

        input.addEventListener("input", () => {
            range.value = input.value;
            callback();
        });
    }

    function calculateSIP() {

        const r = Math.pow(1 + rate.value / 100, 1 / 12) - 1;
        const n = years.value * 12;

        let invested, total;

        if (mode === "sip") {

            const P = Number(sipAmount.value);

            invested = P * n;
            total = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

        } else {

            const P = Number(lumpAmount.value);

            invested = P;
            total = P * Math.pow(1 + r, n);
        }

        investedEl.innerText = format(invested);
        returnsEl.innerText = format(total - invested);
        totalEl.innerText = format(total);
    }

    sipBtn.addEventListener("click", () => {

        mode = "sip";

        sipInputs.classList.remove("d-none");
        lumpInputs.classList.add("d-none");

        sipBtn.classList.add("active");
        lumpBtn.classList.remove("active");

        calculateSIP();
    });

    lumpBtn.addEventListener("click", () => {

        mode = "lump";

        sipInputs.classList.add("d-none");
        lumpInputs.classList.remove("d-none");

        lumpBtn.classList.add("active");
        sipBtn.classList.remove("active");

        calculateSIP();
    });

    sync(sipAmount, sipAmountInput, calculateSIP);
    sync(lumpAmount, lumpAmountInput, calculateSIP);
    sync(rate, rateInput, calculateSIP);
    sync(years, yearsInput, calculateSIP);

    // -----------------------------
    // SWP Calculator
    // -----------------------------
    const swpInvestment = document.getElementById("swpInvestment");
    const swpInvestmentInput = document.getElementById("swpInvestmentInput");

    const swpWithdrawal = document.getElementById("swpWithdrawal");
    const swpWithdrawalInput = document.getElementById("swpWithdrawalInput");

    const swpRate = document.getElementById("swpRate");
    const swpRateInput = document.getElementById("swpRateInput");

    const swpYears = document.getElementById("swpYears");
    const swpYearsInput = document.getElementById("swpYearsInput");

    const swpInitial = document.getElementById("swpInitial");
    const swpWithdrawn = document.getElementById("swpWithdrawn");
    const swpBalance = document.getElementById("swpBalance");
    const swpInsight = document.getElementById("swpInsight");

    function calculateSWP() {

        let balance = Number(swpInvestment.value);
        const initial = balance;
        const withdrawal = Number(swpWithdrawal.value);
        const monthlyRate = Math.pow(1 + swpRate.value / 100, 1 / 12) - 1;
        const months = Number(swpYears.value) * 12;

        let totalWithdrawal = 0;

        for (let i = 0; i < months; i++) {

            balance = balance * (1 + monthlyRate) - withdrawal;

            if (balance <= 0) {
                balance = 0;
                break;
            }

            totalWithdrawal += withdrawal;
        }

        swpInitial.innerText = format(initial);
        swpWithdrawn.innerText = format(totalWithdrawal);
        swpBalance.innerText = format(balance);

        swpInsight.innerText =
            balance === 0
                ? "⚠️ Your investment may not last full duration."
                : "✅ Your withdrawal plan is sustainable.";
    }

    sync(swpInvestment, swpInvestmentInput, calculateSWP);
    sync(swpWithdrawal, swpWithdrawalInput, calculateSWP);
    sync(swpRate, swpRateInput, calculateSWP);
    sync(swpYears, swpYearsInput, calculateSWP);

    calculateSIP();
    calculateSWP();

});