(function manageWheel() {
    const allowedNicknames = ['Крош', 'Node', 'NickAce'];
    let scriptRunning = false;
    let intervalId = null;

    function simulateUserClick(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const offsetX = Math.random() * rect.width * 0.8 + rect.width * 0.1;
        const offsetY = Math.random() * rect.height * 0.8 + rect.height * 0.1;
        const eventOptions = {
            bubbles: true, cancelable: true, view: window,
            clientX: rect.left + offsetX, clientY: rect.top + offsetY
        };

        element.dispatchEvent(new MouseEvent("mouseover", eventOptions));
        element.dispatchEvent(new MouseEvent("mousemove", eventOptions));

        setTimeout(() => {
            element.dispatchEvent(new MouseEvent("mousedown", eventOptions));
            setTimeout(() => {
                element.dispatchEvent(new MouseEvent("mouseup", eventOptions));
                element.dispatchEvent(new MouseEvent("click", eventOptions));
            }, Math.random() * 100 + 50);
        }, Math.random() * 150 + 50);
    }

    function processWheelActions() {
        const vmmoWheel = document.querySelector('.vmmo-wheel');
        const spinButton = document.querySelector('#wheel-button');
        const adContent = document.querySelector('[data-fullscreen-element-name="ad-content"]');
        const wheelLink = document.getElementById("menu_wheel");
        const activeSlider = document.querySelector('a.slider-link._active[href="https://vmmo.ru/cabinet/wheel"]');

        if (adContent) return;

        if (vmmoWheel?.classList.contains('_lock') && wheelLink) {
            simulateUserClick(wheelLink);
        } else if (spinButton) {
            simulateUserClick(spinButton);
        } else if (activeSlider && wheelLink) {
            simulateUserClick(wheelLink);
        }
    }

    function closeAdOnTimeout() {
        const adCloseButton = document.querySelector("[data-fullscreen-element-name='close-btn']");
        if (!document.querySelector("[data-fullscreen-element-name='timeout']") && adCloseButton) {
            simulateUserClick(adCloseButton);
        }
    }

    function startScript() {
        if (intervalId) return;
        scriptRunning = true;
        localStorage.setItem("wheelScriptActive", "true");
        document.getElementById("wheelToggleBtn").textContent = "Остановить";
        intervalId = setInterval(() => {
            processWheelActions();
            closeAdOnTimeout();
        }, 2000);
    }

    function stopScript() {
        scriptRunning = false;
        localStorage.setItem("wheelScriptActive", "false");
        document.getElementById("wheelToggleBtn").textContent = "Запустить";
        clearInterval(intervalId);
        intervalId = null;
    }

    function toggleScript() {
        if (scriptRunning) {
            stopScript();
        } else {
            startScript();
        }
    }

    function createMenu() {
        if (document.getElementById("wheelControlMenu")) return;

        const menu = document.createElement("div");
        menu.id = "wheelControlMenu";
        menu.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 999999;
            font-family: sans-serif;
        `;

        menu.innerHTML = `
            <div style="margin-bottom:5px; font-weight:bold;">Wheel Control</div>
            <button id="wheelToggleBtn" style="
                background: #4CAF50;
                border: none;
                padding: 5px 10px;
                color: white;
                border-radius: 5px;
                cursor: pointer;
            ">Запустить</button>
        `;

        document.body.appendChild(menu);
        document.getElementById("wheelToggleBtn").addEventListener("click", toggleScript);
    }

    function initializeScript() {
        const sliderNicknameElement = document.querySelector('.slider-title span:last-child');
        const currentNickname = sliderNicknameElement ? sliderNicknameElement.textContent.trim() : 'Неизвестный';

        if (!allowedNicknames.includes(currentNickname)) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                background: #fff;
                border: 2px solid red;
                z-index: 9999;
                text-align: center;
            `;
            errorDiv.innerHTML = `
                <h2>Нет доступа</h2>
                <button onclick="this.parentElement.remove()">OK</button>
            `;
            document.body.appendChild(errorDiv);
            return;
        }

        createMenu();

        if (localStorage.getItem("wheelScriptActive") === "true") {
            startScript();
        }
    }

    // При первой установке запоминаем код, чтобы он сам себя запускал при перезагрузке
    if (!localStorage.getItem("wheelScriptCode")) {
        localStorage.setItem("wheelScriptCode", '(' + manageWheel.toString() + ')();');
    }

    initializeScript();

    // Автовосстановление при загрузке страницы
    if (!window.wheelAutoRestore) {
        window.wheelAutoRestore = true;
        const restoreCode = localStorage.getItem("wheelScriptCode");
        if (restoreCode) {
            window.addEventListener("load", function () {
                eval(restoreCode);
            });
        }
    }
})();
