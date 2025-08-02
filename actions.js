module.exports = function (self) {
    let actions = {};

    actions['set_focused_viewport'] = {
        name: "Set Focused Viewport",
        options: [
            {
                "id": 'viewportIndex',
                "type": "textinput",
                "label": 'Viewport Index (0 = first viewport)',
                "default": '0'
            },
            {
                "id": 'viewerIndex',
                "type": "textinput",
                "label": 'Viewer Index (0 = first viewer)',
                "default": '0'
            }
        ],
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
        options: [
            {
                "id": 'viewportIndex',
                "type": "textinput",
                "label": 'Viewport Index (0 = first viewport)',
                "default": '0'
            },
            {
                "id": 'viewerIndex',
                "type": "textinput",
                "label": 'Viewer Index (0 = first viewer)',
                "default": '0'
            },
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
        ],
        callback: async(ev) => {
             let src = ev.options.sourcedd;
            if(!src) {
                src = ev.options.source;
            }

            let index = ev.options.viewportIndex;
            let viewerIndex = ev.options.viewerIndex;
            let route = `viewer/${viewerIndex}/output/${index}/sourcename/${src}`;
            console.warn('About to access route', route, ev.options);
            await self.getWithoutResult(route)
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
