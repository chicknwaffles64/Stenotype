let disabledRun = ''
let disabledStop = ''

const runButton = document.getElementById('runScript')
const stopButton = document.getElementById('stopScript')

document.addEventListener('DOMContentLoaded', () => {
    browser.storage.local.get('disabledRun').then(result => {
        disabledRun = result.disabledRun
        runButton.classList.toggle(disabledRun)
        if (disabledRun === 'disabled') {
            document.getElementById('progress').textContent = 'Transcription currently in progress...'
            document.getElementById('progress').classList.add('blink')
        }
    });
    browser.storage.local.get('disabledStop').then(result => {
        disabledStop = result.disabledStop
        if (disabledStop) {
            stopButton.classList.remove('disabled')
            document.getElementById('copy').classList.remove('disabled')
        }
        stopButton.classList.toggle(disabledStop)
    })
});

document.addEventListener('click', (e) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0].url.includes('youtube.com')) return

        switch (e.target) {
            case document.getElementById('hideCaptions'):
                chrome.tabs.sendMessage(tabs[0].id, { action: "hideCaptions" });
            break;

            case document.getElementById('copy'):
                chrome.tabs.sendMessage(tabs[0].id, { action: "copy" });
                document.getElementById('alert').textContent = "Transcript saved to clipboard!"
                setTimeout(() => {
                    document.getElementById('alert').textContent = ""
                  }, "1500");
                  
            break;
            } 

        function buttonAppearance(active, disabled) {
            runButton.classList.remove(active)
            runButton.classList.add(disabled)
            disabledRun = disabled
            browser.storage.local.set({ disabledRun });

            stopButton.classList.remove(disabled)
            stopButton.classList.add(active)
            disabledStop = active
            browser.storage.local.set({ disabledStop });

            if (active === 'active') {
                document.getElementById('progress').textContent = 'Transcription currently in progress...'
                document.getElementById('progress').classList.add('blink')
            } else {
                document.getElementById('progress').textContent = 'Click with captions visible to start transcribing'
                document.getElementById('progress').classList.remove('blink')
                document.getElementById('copy').classList.remove('disabled')
                
            }
        }

        switch (e.target) {
            case runButton:
                buttonAppearance('active', 'disabled')
                chrome.tabs.sendMessage(tabs[0].id, { action: "runScript" });
            break;

            case stopButton:
                buttonAppearance('disabled', 'active')
                chrome.tabs.sendMessage(tabs[0].id, { action: "stopScript" });
            break;
        }
    });
});