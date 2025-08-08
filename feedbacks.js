const { combineRgb } = require('@companion-module/base')

module.exports = async function (self, FIELDS) {
    let feedbacks = {
        /*
            Description: Changes the button color if the viewport provided is projecting
            Defaults to red color
            Note: if projector and viewport are both unassigned (Null) it returns a false so it doesn't give a false positive
        */
        projectViewportBool: {
			name: 'isProjectingViewport',
			type: 'boolean',
			label: 'Projecting Viewport',
			defaultStyle: {
				bgcolor: combineRgb(160, 0, 0),
				color: combineRgb(255, 255, 255),
			},
            options: [ FIELDS.Viewer, FIELDS.Viewport],
			callback: (feedback) => {
                // console.log(feedback);
                // self.log('info', `Feedback callback!${feedback.options.viewportProjection}`, feedback, feedback.options.viewportProjection);

                let viewport = feedback.options.viewportIndex;
                let viewer = feedback.options.viewerIndex;

                let viewerProjectorNDISource = self.state.current.viewers[viewer].projectorSource.ndiSource;
                let viewportNdisource = self.state.current.viewers[viewer].outputs[viewport].ndiSource

                // self.log('info', `Project Feedback callback!${viewer0projectorndisource}==${viewportNdisource}`);
                
                //fix a bug where if the ndi source and projector source are both null that it doesn't show red on the feedback
                if (viewerProjectorNDISource == null && viewportNdisource == null) {
                    return false;
                }

                return viewerProjectorNDISource == viewportNdisource;
			},
        },
        /*
            Description: If you are audio monitoring the viewport adds a audio emoji
            Defaults to a audio emoji
            Note: currently you can only listen to one source as of this time
        */
        audioMonitoringViewportBool: {
			name: 'isAudioMonitoringViewport',
			type: 'boolean',
			label: 'Audio Monitoring Viewport',
            defaultStyle: {
                text: "0🔊"
			},
            options: [FIELDS.Viewer, FIELDS.Viewport],
			callback: (feedback) => {
                // console.log(feedback);
                // self.log('info', `Listen Feedback callback!${feedback.options.viewportProjection}`, feedback, feedback.options.viewportProjection);

                let viewport = feedback.options.viewportIndex;
                let viewer = feedback.options.viewerIndex;

                // self.log('info', `Listen callback! vp${viewport} viewer${viewer}`);

                let viewerAudioSource = self.state.current.viewers[viewer].audioMonitorSourceName;
                let viewportNDISource = self.state.current.viewers[viewer].outputs[viewport].ndiSource

                // self.log('info', `Listen callback!${vieweraudioSource}==${viewportNdisource}`);
                
                return viewerAudioSource == viewportNDISource;
			},
        },

    };

    self.setFeedbackDefinitions(feedbacks);

    return;

	self.setFeedbackDefinitions({
		SlotSource: {
			name: 'Source is Assigned to Slot',
			type: 'boolean',
			label: 'Source Assigned to Slot',
			defaultStyle: {
				bgcolor: combineRgb(160, 0, 0),
				color: combineRgb(255, 255, 255),
			},
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
					id: 'sourcename',
					type: 'textinput',
					label: 'Custom NDI Source Name',
					default: ''
				},
			],
			callback: (feedback) => {
                console.log(feedback);
				self.log('info', 'Feedback callback!', feedback, feedback.options.sourcedd, feedback.options.sourcename, feedback.options.slot)


                let slotCode = feedback.options.slot;
                let sourceName = feedback.options.sourcedd || feedback.options.sourcename;

                if(!slotCode || !sourceName) {
                    return false;
                }

                let slot = self.state.slots.find(x => x.code == slotCode);
                if(!slot) {
                    return false;
                }

                
                return slot.sourceName == sourceName;
			},
		},
        LockedSlot: {
			name: 'Slot is Locked',
			type: 'boolean',
			label: 'Slot is Locked',
			defaultStyle: {
				bgcolor: combineRgb(160, 160, 0),
				color: combineRgb(0, 0, 0),
			},
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
			callback: (feedback) => {
				self.log('info', 'Feedback callback!', feedback,feedback.options.slot)


                let slotCode = feedback.options.slot;
                if(!slotCode) {
                    return false;
                }

                let slot = self.state.slots.find(x => x.code == slotCode);
                if(!slot) {
                    return false;
                }

                return slot.isLocked;
			},
		},
	})


}
