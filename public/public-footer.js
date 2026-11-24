/* =========================================================
   GFT PUBLIC FOOTER
   Shared footer for public-facing Guvaza Family Trust pages.
   Admin / Founder pages should NOT load this file.
   ========================================================= */

(function () {
    "use strict";

    function safe(value, fallback) {
        return value === undefined || value === null || value === ""
            ? (fallback || "")
            : String(value);
    }

    let serverFooterConfig = null;
    const configEndpoint = document.currentScript?.dataset.configEndpoint || '/api/config/public';
    function getConfig() {
        return serverFooterConfig || window.TRUST_CONFIG || {};
    }

    function createEl(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    }

    function makeLink(href, label, icon) {
        const a = document.createElement("a");
        a.href = href ? new URL(href, "https://guvazafamilytrust.com/").href : "#";
        a.className = "gft-footer-link";

        if (icon) {
            const i = createEl("span", "material-icons-round", icon);
            a.appendChild(i);
        }

        a.appendChild(document.createTextNode(label));
        return a;
    }

    function renderFooter() {
        const mount = document.getElementById("gft-public-footer");
        if (!mount || mount.dataset.rendered === "true") return;

        const CFG = getConfig();
        const contact = CFG.contact || {};
        const social = Array.isArray(CFG.social) ? Object.fromEntries(CFG.social.map(item => [String(item.platform || '').toLowerCase(), item.url])) : (CFG.social || {});
        const year = new Date().getFullYear();

        const footer = createEl("footer", "gft-public-footer");

        /* Main footer */
        const main = createEl("div", "gft-footer-main");
        const grid = createEl("div", "gft-footer-grid");

        /* Trust identity */
        const identity = createEl("div", "gft-footer-identity");

        const logo = createEl("div", "gft-footer-logo");
        const logoIcon = createEl("span", "material-icons-round", "account_balance");
        logo.appendChild(logoIcon);

        const trustName = createEl(
            "div",
            "gft-footer-trust-name",
            safe(CFG.trustName || CFG.name, "Guvaza Family Trust")
        );

        logo.appendChild(trustName);
        identity.appendChild(logo);

        const tagline = createEl(
            "p",
            "gft-footer-tagline",
            safe(
                CFG.footerTagline,
                "Building a legacy of family, knowledge, enterprise and generations."
            )
        );
        identity.appendChild(tagline);

        const heritage = createEl("div", "gft-footer-heritage");
        heritage.textContent = "FAMILY • HERITAGE • KNOWLEDGE • GROWTH";
        identity.appendChild(heritage);

        /* Explore */
        const explore = createEl("div", "gft-footer-column");
        explore.appendChild(createEl("h3", "", "Explore"));
        explore.appendChild(makeLink("index.html", "Home", "home"));
        explore.appendChild(makeLink("about.html", "About", "info"));
        explore.appendChild(makeLink("register.html", "Beneficiary Registration", "how_to_reg"));
        explore.appendChild(makeLink("companies.html", "Our Companies", "business"));
        explore.appendChild(makeLink("library.html", "Guvaza Library", "menu_book"));

        /* Trust */
        const trust = createEl("div", "gft-footer-column");
        trust.appendChild(createEl("h3", "", "Trust"));
        trust.appendChild(makeLink("contact.html", "Contact", "contact_mail"));
        trust.appendChild(makeLink("beneficiary-login.html?login=1", "Beneficiary Portal", "person"));
        trust.appendChild(makeLink("library.html", "Knowledge & Publications", "auto_stories"));

        /* Contact */
        const connect = createEl("div", "gft-footer-column");
        connect.appendChild(createEl("h3", "", "Connect"));

        const email = safe(contact.email, "");
        const phone = safe(contact.phone, "");
        const whatsapp = safe(contact.whatsapp, "");

        if (email) {
            connect.appendChild(
                makeLink("mailto:" + email, email, "email")
            );
        }

        if (phone) {
            connect.appendChild(
                makeLink("tel:" + phone.replace(/[^\d+]/g, ""), phone, "phone")
            );
        }

        if (whatsapp) {
            let wa = whatsapp.replace(/[^\d]/g, "");
            if (wa && wa.charAt(0) === "0") wa = "27" + wa.substring(1);

            connect.appendChild(
                makeLink(
                    "https://wa.me/" + wa,
                    "WhatsApp",
                    "chat"
                )
            );
        }

        /* Social links */
        const socialWrap = createEl("div", "gft-footer-social");

        const socialItems = [
            ["facebook", "Facebook", social.facebook],
            ["photo_camera", "Instagram", social.instagram],
            ["play_circle", "YouTube", social.youtube],
            ["music_note", "TikTok", social.tiktok],
            ["alternate_email", "X", social.x || social.twitter]
        ];

        socialItems.forEach(function (item) {
            if (!item[2]) return;

            const a = document.createElement("a");
            a.href = item[2];
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "gft-footer-social-btn";
            a.title = item[1];
            a.setAttribute("aria-label", item[1]);

            const icon = createEl("span", "material-icons-round", item[0]);
            a.appendChild(icon);
            socialWrap.appendChild(a);
        });

        if (socialWrap.children.length) {
            connect.appendChild(socialWrap);
        }

        grid.appendChild(identity);
        grid.appendChild(explore);
        grid.appendChild(trust);
        grid.appendChild(connect);

        main.appendChild(grid);
        footer.appendChild(main);

        /* Bottom bar */
        const bottom = createEl("div", "gft-footer-bottom");
        const bottomInner = createEl("div", "gft-footer-bottom-inner");

        const copyright = createEl(
            "span",
            "",
            "© " + year + " " +
            safe(CFG.trustName || CFG.name, "The Guvaza Family Trust") +
            ". All Rights Reserved."
        );

        const status = createEl(
            "span",
            "gft-footer-status",
            "PUBLIC WEBSITE"
        );

        bottomInner.appendChild(copyright);
        bottomInner.appendChild(status);
        bottom.appendChild(bottomInner);
        footer.appendChild(bottom);

        mount.replaceChildren(footer);
        mount.dataset.rendered = "true";
    }

    async function boot() {
        renderFooter();
        try {
            const response = await fetch(configEndpoint, { credentials: 'omit', signal: AbortSignal.timeout(8000) });
            const result = await response.json();
            if (!response.ok || !result.ok || !result.config) return;
            serverFooterConfig = result.config;
            const mount = document.getElementById('gft-public-footer');
            if (mount) delete mount.dataset.rendered;
            renderFooter();
        } catch { /* Keep navigation available during a temporary outage. */ }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }

    window.GFT_PUBLIC_FOOTER = {
        render: renderFooter
    };
})();
