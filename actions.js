module.exports = function (self, FIELDS) {
    let actions = {};

    actions['set_focused_viewport'] = {
        name: "Set Focused Viewport",
        options: [FIELDS.Viewer,FIELDS.Viewport],
        callback: async(ev) => {
            let index = ev.options.viewportIndex;
            let viewerIndex = ev.options.viewerIndex;
            let route = `viewer/${viewerIndex}/focus/${index}`;
            console.warn('About to access route', route, ev.options);
            await self.getWithoutResult(route)
        }
    };

    actions['set_viewport_source'] = {
        name: "Set Viewport Source",
        options: [ FIELDS.Viewer,FIELDS.Viewport,
            {
                id: 'sourcedd',
                type: 'dropdown',
                label: 'NDI Source',
                default: '',
                choices: [{id: '', label: '(Use Custom Source Name)'}, ...self.state.sources.map(o => ({
                    id: o.name,
                    label: `${o.name}`
                }))],
                useVariables: true,
            },
            {
                id: 'source',
                type: 'textinput',
                label: 'Custom NDI Source Name',
                default: "",
                min: 0,
                max: 300,
                useVariables: true,
            },
        ],
        callback: async(ev, context) => {
             let src = ev.options.sourcedd;
            if (!src) {
                src = await context.parseVariablesInString(ev.options.source || '')
                // src = ev.options.source;
            }

            let index = ev.options.viewportIndex;
            let viewerIndex = ev.options.viewerIndex;
            let route = `viewer/${viewerIndex}/output/${index}/sourcename/${src}`;
            console.warn('About to access route', route, ev.options);
            await self.getWithoutResult(route)
        }
    };

    /*
    Function: Project Viewer
    Options: viewer number and viewport number
    Description: Fullscreen viewport on multiview 
    Notes: If viewport is already projected will stop projection
    */
    actions['project'] = {
			name: 'Project Viewer',
			options: [FIELDS.Viewer,FIELDS.Viewport],
			callback: async (action, context) => {
				try {
					let viewer_num = await context.parseVariablesInString(action.options.viewerIndex || '0')
                    let viewer_port = await context.parseVariablesInString(action.options.viewportIndex || '0')
                    
                    // self.log('info', `project called! vn:${viewer_num} vp:${viewer_port}`);

                    let viewerProjectedNDISource = self.state.current.viewers[viewer_num].projectorSource.ndiSource;
                    let viewportNDIsource = self.state.current.viewers[viewer_num].outputs[viewer_port].ndiSource

                    let url = `viewer/${viewer_num}/project/viewport/${viewer_port}` 

                    // if your already projecting the same source, stop projecting
                    if (viewerProjectedNDISource == viewportNDIsource) {
                        url = `viewer/${viewer_num}/project/stop`
                    }

                    await self.getWithoutResult(url)
				} catch (e) {
					self.log('error', `HTTP GET Request failed (${e.message})`)
					self.updateStatus(InstanceStatus.UnknownError, e.code)
				}
			}
    };

    /*
    Function: Stop Project
    Options: viewer number 
    Description: Stop projecting the viewport
    */
    actions['stop_project'] = {
        name: 'Stop Project',
        options: [FIELDS.Viewer],
        callback: async (action, context) => {
            try {
                let viewer_num = await context.parseVariablesInString(action.options.viewer || '0')
                let url = `viewer/${viewer_num}/project/stop`
                await self.getWithoutResult(url)
            } catch (e) {
                self.log('error', `HTTP GET Request failed (${e.message})`)
                self.updateStatus(InstanceStatus.UnknownError, e.code)
            }
        }
    };

    /*
    Function: Audio Monitor Viewport
    Options: viewer number and viewport number 
    Description: Audio monitor a viewport
    Notes: If you select the same viewport it will stop listening
    */
    actions['listen'] = {
			name: 'Audio Monitor Viewport',
			options: [FIELDS.Viewer,FIELDS.Viewport],
			callback: async (action, context) => {
				try {
					let viewer_num = await context.parseVariablesInString(action.options.viewerIndex || '0')
                    let viewer_port = await context.parseVariablesInString(action.options.viewportIndex || '0')
                    
                    // self.log('info', `listen called! vn:${viewer_num} vp:${viewer_port}`);

                    let viewerAudioSource = self.state.current.viewers[viewer_num].audioMonitorSourceName;
                    let viewportNDISource = self.state.current.viewers[viewer_num].outputs[viewer_port].ndiSource

                    let url = `viewer/${viewer_num}/listen/stop` 
                    await self.getWithoutResult(url)

                    //if its not the same audio monitor listen to the new source
                    if(viewerAudioSource != viewportNDISource){
                        url = `viewer/${viewer_num}/listen/viewport/${viewer_port}` 
                        await self.getWithoutResult(url)
                    }
				} catch (e) {
					self.log('error', `HTTP GET Request failed (${e.message})`)
					self.updateStatus(InstanceStatus.UnknownError, e.code)
				}
			}
    };

    /*
    Function: Audio Monitor Viewport
    Options: viewer number  
    Description: Stop Audio monitoring a viewport
    */
    actions['stoplisten'] = {
			name: 'Stop Audio Monitor',
			options: [FIELDS.Viewer],
			callback: async (action, context) => {
				try {
					let viewer_num = await context.parseVariablesInString(action.options.viewerIndex || '0')
                    
                    // self.log('info', `stop listen called! vn:${viewer_num} `);

                    let url = `viewer/${viewer_num}/listen/stop` 
                    await self.getWithoutResult(url)

				} catch (e) {
					self.log('error', `HTTP GET Request failed (${e.message})`)
					self.updateStatus(InstanceStatus.UnknownError, e.code)
				}
			}
    };
    
    /*
    Function: Load Preset
    Options: viewer number and preset number  
    Description: load preset
    */
    actions['load_preset'] = {
        name: 'Load Preset',
			options: [FIELDS.Viewer, FIELDS.PresetNum],
			callback: async (action, context) => {
				try {
                    let viewer_num = await context.parseVariablesInString(action.options.viewerIndex || '0')
                    let preset_num = await context.parseVariablesInString(action.options.presetNum || '0')
                    
                    // self.log('info', `stop listen called! vn:${viewer_num} `);

                    let url = `viewer/${viewer_num}/loadpreset/${preset_num}` 
                    await self.getWithoutResult(url)

				} catch (e) {
					self.log('error', `HTTP GET Request failed (${e.message})`)
					self.updateStatus(InstanceStatus.UnknownError, e.code)
				}
			}
    };

    /*
    Function: Save Preset
    Options: viewer number and preset number  
    Description: Save preset
    */
    actions['save_preset'] = {
        name: 'Save Preset',
			options: [FIELDS.Viewer, FIELDS.PresetNum],
			callback: async (action, context) => {
				try {
                    let viewer_num = await context.parseVariablesInString(action.options.viewerIndex || '0')
                    let preset_num = await context.parseVariablesInString(action.options.presetNum || '0')
                    
                    // self.log('info', `stop listen called! vn:${viewer_num} `);

                    let url = `viewer/${viewer_num}/savepreset/${preset_num}` 
                    await self.getWithoutResult(url)

				} catch (e) {
					self.log('error', `HTTP GET Request failed (${e.message})`)
					self.updateStatus(InstanceStatus.UnknownError, e.code)
				}
			}
    };
    
    /*
    Function: KVM Mode
    Options: viewer number and kvm mode: string  
    Description: Change KVM mode
    Notes: Sets a variable of what mode your on
    */
    actions['kvm_mode'] = {
        name: 'KVM Mode',
			options: [FIELDS.Viewer, FIELDS.KVMNewMode],
			callback: async (action, context) => {
				try {
                    let viewer_num = await context.parseVariablesInString(action.options.viewerIndex || '0')
                    let kvm_new_mode = await context.parseVariablesInString(action.options.kvmNewMode || '0')
                    
                    // self.log('info', `kvm mode called! vn:${viewer_num} `);

                    let url = `viewer/${viewer_num}/kvm/mode/${kvm_new_mode}` 
                    await self.getWithoutResult(url)
                    
                    self.setVariableValues({ 'KVMNewMode': kvm_new_mode })

				} catch (e) {
					self.log('error', `HTTP GET Request failed (${e.message})`)
					self.updateStatus(InstanceStatus.UnknownError, e.code)
				}
			}
    };

    /*
    Function: KVM Mode
    Options: viewer number and lockout mode: string  
    Description: Change PTZ Lockout mode
    Notes: Sets a variable of what mode your on
    */
    actions['ptz_lockout_mode'] = {
        name: 'PTZ Lockout Mode',
			options: [FIELDS.Viewer, FIELDS.LockoutNewMode],
			callback: async (action, context) => {
				try {
                    let viewer_num = await context.parseVariablesInString(action.options.viewerIndex || '0')
                    let ptz_lockout_mode = await context.parseVariablesInString(action.options.kvmNewMode || '0')
                    
                    // self.log('info', `ptz lockout mode called! vn:${viewer_num} `);
                                        
                    let url = `viewer/${viewer_num}/ptz/lockoutmode/${ptz_lockout_mode}` 
                    await self.getWithoutResult(url)

                    self.setVariableValues({ 'PTZLockoutMode': ptz_lockout_mode })

				} catch (e) {
					self.log('error', `HTTP GET Request failed (${e.message})`)
					self.updateStatus(InstanceStatus.UnknownError, e.code)
				}
			}
    };

    self.setActionDefinitions(actions);

    return;

	self.setActionDefinitions({
		set_slot_output: {
			name: 'Set Slot Source',
			options: [
                {
                    id: 'sourcedd',
                    type: 'dropdown',
                    label: 'NDI Source',
                    default: '',
                    choices: [{id: '', label: '(Use Custom Source Name)'}, ...self.state.sources.map(o => ({
                        id: o.name,
                        label: `${o.name}`
                    }))]
                },
				{
					id: 'source',
					type: 'textinput',
					label: 'Custom NDI Source Name',
					default: "",
					min: 0,
					max: 300,
				},
                {
                    id: 'slot',
                    type: 'dropdown',
                    label: 'Router Slot',
                    default: '',
                    choices: self.state.slots.map(o => ({
                        id: o.code,
                        label: `${o.slotName} (${o.code})`
                    }))
                }
			],
			callback: async (event) => {
                let src = event.options.sourcedd;
                if(!src) {
                    src = event.options.source;
                }

                await self.put(`slots/${event.options.slot}/set/${src}`);
			},
		},

		lock_slot: {
			name: 'Lock Slot',
			options: [
                {
                    id: 'slot',
                    type: 'dropdown',
                    label: 'Router Slot',
                    default: '',
                    choices: self.state.slots.map(o => ({
                        id: o.code,
                        label: `${o.slotName} (${o.code})`
                    }))
                }
			],
			callback: async (event) => {
                await self.put(`slots/lock/${event.options.slot}`);
			},
		},

		unlock_slot: {
			name: 'Unlock Slot',
			options: [
                {
                    id: 'slot',
                    type: 'dropdown',
                    label: 'Router Slot',
                    default: '',
                    choices: self.state.slots.map(o => ({
                        id: o.code,
                        label: `${o.slotName} (${o.code})`
                    }))
                }
			],
			callback: async (event) => {
                await self.put(`slots/unlock/${event.options.slot}`);
			},
		},



        clear_slot_output: {
            name: 'Clear Slot Output',
			options: [
                {
                    id: 'slot',
                    type: 'dropdown',
                    label: 'Router Slot',
                    default: '',
                    choices: self.state.slots.map(o => ({
                        id: o.code,
                        label: `${o.slotName} (${o.code})`
                    }))
                }
			],
			callback: async (event) => {
                await self.put(`slots/${event.options.slot}/clear`);
			},            
        },
	})
}
