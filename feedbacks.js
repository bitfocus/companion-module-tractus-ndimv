const { combineRgb } = require('@companion-module/base')

module.exports = async function (self, FIELDS) {
    let feedbacks = {
        //#region projectViewport
        /*
            Description: Changes the button color if the viewport provided is projecting
            Defaults to red color
            Note: if projector and viewport are both unassigned (Null) it returns a false so it doesn't give a false positive
        */
       //#endregion
        projectViewportBool: {
			name: 'isProjectingViewport',
			type: 'boolean',
			label: 'Projecting Viewport',
			defaultStyle: {
				bgcolor: combineRgb(160, 0, 0),
				color: combineRgb(255, 255, 255),
			},
            options: [ FIELDS.Viewer, FIELDS.Viewport],
			callback: async(feedback, context) => {
                // console.log(feedback);
                // self.log('info', `Feedback callback!${feedback.options.viewportProjection}`, feedback, feedback.options.viewportProjection);

                let viewport = await context.parseVariablesInString(feedback.options.viewportIndex) || '0';
                let viewer = await context.parseVariablesInString(feedback.options.viewerIndex) || '0';

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
        //#region audio
        /*
            Description: If you are audio monitoring the viewport adds a audio emoji
            Defaults to a audio emoji
            Note: currently you can only listen to one source as of this time
        */
       //#endregion
        audioMonitoringViewportBool: {
			name: 'isAudioMonitoringViewport',
			type: 'boolean',
			label: 'Audio Monitoring Viewport',
            defaultStyle: {
                text: "0🔊"
			},
            options: [FIELDS.Viewer, FIELDS.Viewport],
			callback: async(feedback, context) => {
                // console.log(feedback);
                // self.log('info', `Listen Feedback callback!${feedback.options.viewportIndex}`, feedback, feedback.options.viewerIndex);

                let viewport = await context.parseVariablesInString(feedback.options.viewportIndex) || '0';
                let viewer = await context.parseVariablesInString(feedback.options.viewerIndex) || '0';

                // self.log('info', `Listen callback! vp${viewport} viewer${viewer}`);

                let viewerAudioSource = self.state.current.viewers[viewer].audioMonitorSourceName;
                let viewportNDISource = self.state.current.viewers[viewer].outputs[viewport].ndiSource

                // self.log('info',`vas: ${viewerAudioSource}`);
                // self.log('info',`vns: ${viewportNDISource}`);
                
                if (viewerAudioSource == null && viewportNDISource == null) {
                    self.log('info',`both null`)
                    return false;
                }


                self.log('info', `Listen callback!${viewport} ${viewerAudioSource}==${viewportNDISource}`);

                // self.log('info', `Listen callback!${viewerAudioSource}==${viewportNDISource}`);
                
                return viewerAudioSource == viewportNDISource;
			},
        },
        // imageShow: {
        //     name: 'Image is Showing',
        //     type: 'boolean',
        //     options: [FIELDS.Viewer, FIELDS.ImageCode],
        //     defaultStyle: {
        //         bgcolor: combineRgb(0, 128, 0),
        //         color: combineRgb(255, 255, 255),
        //     },
        //     callback: (feedback, context) => {
        //         let viewer = feedback.options.viewerIndex
        //         let code   = feedback.options.imageCode

        //         // EXPECTED: this.state.viewerImages[viewer]?.visible[code] === true
        //         return (
        //             self.state?.viewerImages?.[viewer]?.visible?.[code] === true
        //         )
        //     }    
        // },
        // imageHide: {
        //     name: 'Image is Hidden',
        //     type: 'boolean',
        //     options: [FIELDS.Viewer, FIELDS.ImageCode],
        //     defaultStyle: {
        //         bgcolor: combineRgb(128, 0, 0),
        //         color: combineRgb(255, 255, 255),
        //     },
        //     callback: (feedback, context) => {
        //         let viewer = feedback.options.viewerIndex
        //         let code   = feedback.options.imageCode

        //         // EXPECTED: hidden = visible !== true
        //         return (
        //             self.state?.viewerImages?.[viewer]?.visible?.[code] !== true
        //         )
        //     },
        // },
        // captionShow: {
        //     name: 'Caption is Showing',
        //     type: 'boolean',
        //     options: [FIELDS.Viewer, FIELDS.CaptionCode],
        //     defaultStyle: {
        //         bgcolor: combineRgb(0, 64, 160),
        //         color: combineRgb(255, 255, 255),
        //     },
        //     callback: (feedback, context) => {
        //         let viewer = feedback.options.viewerIndex
        //         let code   = feedback.options.captionCode

        //         // EXPECTED: this.state.viewerCaptions[viewer]?.visible[code] === true
        //         return (
        //             self.state?.viewerCaptions?.[viewer]?.visible?.[code] === true
        //         )
        //     },
        // },
        // captionHide: {
        //     name: 'Caption is Hidden',
        //     type: 'boolean',
        //     options: [FIELDS.Viewer, FIELDS.CaptionCode],
        //     defaultStyle: {
        //         bgcolor: combineRgb(120, 0, 0),
        //         color: combineRgb(255, 255, 255),
        //     },
        //     callback: (feedback, context) => {
        //         let viewer = feedback.options.viewerIndex
        //         let code   = feedback.options.captionCode

        //         // EXPECTED: hidden = visible !== true
        //         return (
        //             self.state?.viewerCaptions?.[viewer]?.visible?.[code] !== true
        //         )
        //     },
        // },
        isViewerFocused: {
            name: 'isViewerFocus',
            type: 'boolean',
            options: [FIELDS.Viewer, FIELDS.Viewport],
            defaultStyle: {
                bgcolor: combineRgb(120, 0, 0),
                color: combineRgb(255, 255, 255),
            },
            callback: (feedback) => {
                self.log('info','isviewer callback'); 
                let viewer = feedback.options.viewerIndex;
                let viewport = feedback.options.viewportIndex;

                self.log('info', `isViewer callback! vp${viewport} viewer${viewer}`);

                // EXPECTED: hidden = visible !== true
                self.log('info', `isViewer callback! vp${viewport} viewer${viewer} index${self.state.current.viewers[viewer].focusedViewportIndex}`); 
                return self.state.current.viewers[viewer].focusedViewportIndex == viewport;
                
            },
        },
    };

    self.setFeedbackDefinitions(feedbacks);

    return;

	}
