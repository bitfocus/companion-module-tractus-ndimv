const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdatePresets = require('./presets')
const UpdateVariableDefinitions = require('./variables')
const { EventSource } = require('eventsource');

//Option fields to be used in actions and feedbacks
  const FIELDS = {
        Url: (label) => ({
            type: 'textinput',
            label: label,
            id: 'url',
            default: '',
            useVariables: true,
      }),
        Viewport: {
            id: 'viewportIndex',
            type: "textinput",
            label: 'Viewport Index (0 = first viewport)',
            default: '0',
            useVariables: true,
        },
        Viewer:{
            id: 'viewerIndex',
            type: "textinput",
            label: 'Viewer Index (0 = first viewer)',
            default: '0',
            useVariables: true,
        },
        PresetNum:{
            id: 'presetNum',
            type: "textinput",
            label: 'Preset Number',
            default: '0',
            useVariables: true,
      },
      KVMNewMode: {
            id: 'kvmNewMode',
            type: "dropdown",
            label: 'NewMode',
          default: 'immersive',
          choices: [
              { id: 'explicit', label: 'Explicit' },
              { id: 'immersive', label: 'Immersive' },
            ],
            useVariables: true,
      },
      LockoutNewMode: {
        id: 'kvmNewMode',
            type: "dropdown",
            label: 'NewMode',
          default: 'unlocked',
          choices: [
              { id: 'locked', label: 'Locked' },
              { id: 'unlocked', label: 'Not Locked' },
            ],
            useVariables: true,
      },
      ImageCode: {
            id: 'imageCode',
            type: 'textinput',
            label: 'Image Code',
            default: '',
            useVariables: true,
    },
    CaptionCode: {
        id: 'captionCode',
        type: 'textinput',
        label: 'Caption Code',
        default: '',
        useVariables: true,
    },
    XPos: {
        id: 'xPos',
        type: 'number',
        label: 'X Position',
        default: '0',
        useVariables: true,
    },
    YPos: {
        id: 'yPos',
        type: 'number',
        label: 'Y Position',
        default: '0',
        useVariables: true,
    },
}
    //   OutputNum: {
    //         id: 'outputNum',
    //         type: "number",
    //         label: 'Output Number',
    //         default: '0',
    //         useVariables: true,
    //     },
    // }

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

    async init(config) {
		this.config = config;
        this.state = {};

        this.updateStatus(InstanceStatus.Connecting);

        let didInitOK = false;

        try {
            await this.fetchLatestState();
            await this.setupEventHub();
            // await this.updatePresets();
            didInitOK = true;
        } catch(ex) {
            console.error("Error on startup - ", ex);
            didInitOK = false;
        }

    this.updateStatus(InstanceStatus.Ok)

        if(didInitOK) {
            this.updateStatus(InstanceStatus.Ok)
            this.updateActions() // export actions
            this.updateFeedbacks() // export feedbacks
            this.updateVariableDefinitions() // export variable definitions
            this.updatePresets() // export presets
        } else {
            this.updateStatus(InstanceStatus.ConnectionFailure);
        }

	}

    onEventBusOpen(e) {
        this.updateStatus(InstanceStatus.Ok)
    }

    onEventBusError(e) {
        this.updateStatus(InstanceStatus.ConnectionFailure)
        console.error(e);
    }

    async setupEventHub() {

        
        let hub = new EventSource(`http://${this.config.host}:${this.config.port}/eventbus`);
        hub.onerror = (e) => this.onEventBusError(e);
        hub.onopen = (e) => this.onEventBusOpen(e);
        hub.addEventListener("FocusedViewportChange", () => this.fetchStateAndUpdateFeedback());
        hub.addEventListener("ProjectorChange", () => this.fetchStateAndUpdateFeedback());
        hub.addEventListener("SourceChange", () => this.fetchStateAndUpdateFeedback());
        hub.addEventListener("SendersUpdated", () => this.fetchStateAndUpdateFeedback());
        hub.addEventListener("AudioMonitorSourceChange", () => this.fetchStateAndUpdateFeedback());
        this.hub = hub;

    }

    async handleNdiSourceDiscovered(e) {
        await this.fetchStateAndUpdateFeedback();
        this.updatePresets();
    }

    async fetchStateAndUpdateFeedback(e) {
        try {
            await this.fetchLatestState();
            console.log("Got latest state. Now update feedback.");
            this.updateVariableDefinitions();
            this.checkFeedbacks();
        } catch(ex) {
            console.error("Exception: ", ex);
        }
    }

    async fetchLatestState() {
        this.log("info", this.config.host);
        this.state.current = await this.get('current');

        this.state.sources = this.state.current.sources.flatMap(computer => 
            computer.sources.map(src => ({
                computerName: computer.computerName,
                name: src.name,
                sourceName: src.sourceName
            }))
        );

        //this.state.sources = this.state.current.sources;

    }

    async get(route) {
        let resultRaw = await fetch(`http://${this.config.host}:${this.config.port}/${route}`);
        let result = resultRaw.json();

        return result;
    }

    async getWithoutResult(route) {
        await fetch(`http://${this.config.host}:${this.config.port}/${route}`);
    }


    async put(route) {
        let resultRaw = await fetch(`http://${this.config.host}:${this.config.port}/${route}`, {
            method: 'put'
        });
        let result = resultRaw.json();

        return result;
    }

	// When module gets deleted
	async destroy() {
        if(this.hub) {
            try {
                this.hub.onerror = null;
                this.hub.onopen = null;                
                this.hub.close();
                this.hub = null;
            } catch {

            }
        }

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config;
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
                default: '127.0.0.1',
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
                default: '8901',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

    updatePresets() {
        UpdatePresets(this)
        // let presets = [];
        // return;
        
    
        // }

        // this.setPresetDefinitions(presets);
    }

	updateActions() {
		UpdateActions(this, FIELDS)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this, FIELDS)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
