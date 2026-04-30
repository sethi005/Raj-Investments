document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function () {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    });
});
// Remove hash from URL without reloading
if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
}
document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Stop default # navigation
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Optionally update URL without #
            history.pushState(null, '', window.location.pathname);
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Close mobile navbar when a link is clicked
    const navLinks = document.querySelectorAll('#navMenu .nav-link');
    const navbarCollapse = document.getElementById('navMenu');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if the menu is currently open (has the 'show' class)
            if (navbarCollapse.classList.contains('show')) {
                // Simulate clicking the toggle button to close it
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // Initialize ScrollSpy via JS (more reliable than data attributes alone)
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#navMenu',
        offset: 100
    });
});



document.addEventListener("DOMContentLoaded", function () {

    // INITIAL LOAD
    AOS.init();


    // WhatsApp form FIXED
    document.getElementById("leadForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Get values properly
        let name = document.getElementById("name").value;
        let phone = document.getElementById("phone").value;
        let service = document.getElementById("service").value;

        // Validation (important)
        if (!name || !phone) {
            alert("Please enter Name and Phone Number");
            return;
        }

        // Message
        let msg = `Hello Raj Investments,\n\nI am ${name}\nPhone: ${phone}\nInterested in: ${service}\n\nPlease guide me.`;

        // WhatsApp redirect
        window.open(
            "https://wa.me/919980023402?text=" + encodeURIComponent(msg),
            "_blank"
        );
        // Clear form fields
        this.reset();
    });

});


document.addEventListener("DOMContentLoaded", function () {

    let mode = "sip";
    let invested, returns, total;

    const format = n => new Intl.NumberFormat('en-IN').format(Math.round(n));

    // LISTENERS FOR NAME/MOBILE
    document.getElementById("userName").addEventListener("input", calculate);
    document.getElementById("userMobile").addEventListener("input", calculate);

    // TOGGLE
    sipBtn.onclick = () => {
        mode = "sip";
        sipInputs.classList.remove("d-none");
        lumpInputs.classList.add("d-none");
        sipBtn.classList.add("active");
        lumpBtn.classList.remove("active");
        calculate();
    };

    lumpBtn.onclick = () => {
        mode = "lump";
        sipInputs.classList.add("d-none");
        lumpInputs.classList.remove("d-none");
        lumpBtn.classList.add("active");
        sipBtn.classList.remove("active");
        calculate();
    };

    // SYNC FUNCTION
    function sync(range, input) {
        range.oninput = () => { input.value = range.value; calculate(); };
        input.oninput = () => { range.value = input.value; calculate(); };
    }

    sync(sipAmount, sipAmountInput);
    sync(lumpAmount, lumpAmountInput);
    sync(rate, rateInput);
    sync(years, yearsInput);

    // --- NEW: VALIDATION FUNCTION ---
    function isValid() {
        let name = document.getElementById("userName").value.trim();
        let mobile = document.getElementById("userMobile").value.trim();

        // Remove red borders initially
        document.getElementById("userName").classList.remove("is-invalid");
        document.getElementById("userMobile").classList.remove("is-invalid");

        let valid = true;

        // Name: Must be at least 2 characters, letters and spaces only
        if (!name || !/^[A-Za-z\s]{2,}$/.test(name)) {
            document.getElementById("userName").classList.add("is-invalid");
            valid = false;
        }

        // Mobile: Must be exactly 10 digits
        if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
            document.getElementById("userMobile").classList.add("is-invalid");
            valid = false;
        }

        return valid;
    }

    // CALCULATION
    function calculate() {
        // Silent check (turns borders red if invalid, stops math)
        if (!isValid()) return;

        let r = Math.pow(1 + rate.value / 100, 1 / 12) - 1;
        let n = years.value * 12;

        if (mode === "sip") {
            let P = +sipAmount.value;
            invested = P * n;
            total = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        } else {
            let P = +lumpAmount.value;
            invested = P;
            total = P * Math.pow(1 + r, n);
        }

        returns = total - invested;

        document.getElementById("invested").innerText = format(invested);
        document.getElementById("returns").innerText = format(returns);
        document.getElementById("total").innerText = format(total);
    }

    // CTA BUTTON CLICK
    ctaBtn.onclick = function (e) {
        e.preventDefault();

        // Strict check with alert on button click
        if (!isValid()) {
            alert("Please enter a valid Name (only alphabets) and a valid 10-digit Mobile Number.");
            return;
        }

        let userName = document.getElementById("userName").value.trim();
        let userMobile = document.getElementById("userMobile").value.trim();

        let message = `Name: ${userName}\n\nMobile: ${userMobile}\n\nI want to invest via ${mode.toUpperCase()}:\nAmount: ₹${mode === "sip" ? sipAmount.value : lumpAmount.value}\nYears: ${years.value}\nExpected Value: ₹${format(total)}`;

        window.open("https://wa.me/919980023402?text=" + encodeURIComponent(message), '_blank');
    };

    calculate();
});

document.addEventListener("DOMContentLoaded", function () {

    const format = n => new Intl.NumberFormat('en-IN').format(Math.round(n));

    let initial = 0;
    let totalWithdrawal = 0;
    let balance = 0;

    // LISTENERS FOR NAME/MOBILE
    document.getElementById("userName").addEventListener("input", calculateSWP);
    document.getElementById("userMobile").addEventListener("input", calculateSWP);

    // SYNC FUNCTION
    function sync(range, input) {
        range.oninput = () => { input.value = range.value; calculateSWP(); };
        input.oninput = () => { range.value = input.value; calculateSWP(); };
    }

    const inv = document.getElementById("swpInvestment");
    const invInput = document.getElementById("swpInvestmentInput");
    const withdr = document.getElementById("swpWithdrawal");
    const withdrInput = document.getElementById("swpWithdrawalInput");
    const rate = document.getElementById("swpRate");
    const rateInput = document.getElementById("swpRateInput");

    sync(inv, invInput);
    sync(withdr, withdrInput);
    sync(rate, rateInput);
    sync(swpYears, swpYearsInput);

    // --- NEW: VALIDATION FUNCTION ---
    function isValid() {
        let name = document.getElementById("userName").value.trim();
        let mobile = document.getElementById("userMobile").value.trim();

        document.getElementById("userName").classList.remove("is-invalid");
        document.getElementById("userMobile").classList.remove("is-invalid");

        let valid = true;

        if (!name || !/^[A-Za-z\s]{2,}$/.test(name)) {
            document.getElementById("userName").classList.add("is-invalid");
            valid = false;
        }

        if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
            document.getElementById("userMobile").classList.add("is-invalid");
            valid = false;
        }

        return valid;
    }

    // CALCULATION
    function calculateSWP() {
        // Silent check
        if (!isValid()) return;

        balance = +swpInvestment.value;
        let withdrawal = +swpWithdrawal.value;
        let rate = Math.pow(1 + swpRate.value / 100, 1 / 12) - 1;
        let months = +swpYears.value * 12;

        totalWithdrawal = 0;
        initial = balance;

        for (let i = 0; i < months; i++) {
            balance = balance * (1 + rate) - withdrawal;
            if (balance <= 0) {
                balance = 0;
                months = i + 1;
                break;
            }
            totalWithdrawal += withdrawal;
        }

        swpInitial.innerText = initial;
        swpBalance.innerText = format(balance);
        swpWithdrawn.innerText = format(totalWithdrawal);

        let insight = "";
        if (balance === 0) {
            insight = "⚠️ Your investment may not last full duration.";
        } else {
            insight = "✅ Your withdrawal plan is sustainable.";
        }
        document.getElementById("swpInsight").innerText = insight;
    }

    // CTA BUTTON CLICK
    const swpCTA = document.getElementById("swpCTA");

    swpCTA.onclick = function (e) {
        e.preventDefault();

        // Strict check with alert
        if (!isValid()) {
            alert("Please enter a valid Name (only alphabets) and a valid 10-digit Mobile Number.");
            return;
        }

        let userName = document.getElementById("userName").value.trim();
        let userMobile = document.getElementById("userMobile").value.trim();

        let message = `Name: ${userName}\n\nMobile: ${userMobile}\n\nI want to start an SWP:\nTotal Investment: ₹${swpInvestment.value}\nMonthly Withdrawal: ₹${swpWithdrawal.value}\nYears: ${swpYears.value}\nFinal Expected Balance: ₹${format(balance)}`;

        window.open("https://wa.me/919980023402?text=" + encodeURIComponent(message), '_blank');
    };

    calculateSWP();
});