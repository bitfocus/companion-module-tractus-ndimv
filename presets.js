const {combineRgb} = require('@companion-module/base')

module.exports = function (self) {
    let presets = [];

    for (let i = 1; i <= 8; i++) {
        let toAdd = {
			type: 'button',
			category: 'Projection',
			name: `Project ${i}`,

			style: {
				text: `Project\n ${i}`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},

			steps: [
				{
                    up: [
                        {
							actionId: 'project',
							options: { viewerIndex: 0, viewportIndex: i },
						},
                    ],
					"1000": [
						{
							actionId: 'listen',
							options: { viewerIndex: 0, viewportIndex: i },
						},
					],
					down: [],
				},
			],
			feedbacks: [
                {
                    feedbackId: 'projectViewportBool',
                    options: {viewerIndex: 0, viewportIndex: i},
                    style: {
                        bgcolor: combineRgb(160, 0, 0),
                        color: combineRgb(255, 255, 255),
                    }
                },
                {
                    feedbackId: 'audioMonitoringViewportBool',
                    options: {viewerIndex: 0, viewportIndex: i},
                    style: {
                        bgcolor: combineRgb(160, 0, 0),
                        color: combineRgb(255, 255, 255),
                        text: '0🔊'
                    }
                },
            ],
		}
        // "color": 0,
		//							"bgcolor": 16776960
        

        presets.push(toAdd);
    }

    let toAdd = {
        type: 'button',
        category: 'Presets',
        name: `Load Preset 1`,

        style: {
            text: `Load\nPreset 1`,
            size: 'auto',
            color: combineRgb(255, 255, 255),
            bgcolor: combineRgb(255, 0, 0),
        },

        steps: [
            {
                "1000": [
                    {
                        actionId: 'save_preset',
                        options: { viewerIndex: 0, presetNum: 1 },
                    },
                ],
                up: [
                    {
                        actionId: 'load_preset',
                        options: { viewerIndex: 0, presetNum: 1 },
                    },
                ],
                down: [],
            },
        ],
        feedbacks: [],
    }
    presets.push(toAdd);
    // let toAdd = {
    //                     type: 'button',
    //                     category: 'Slot Assignments',
    //                     name: Name,
    //                     style: {
    //                         text: 'slot.slotName',
    //                         size: 'auto',
    //                         color: combineRgb(255, 255, 255),
    //                         bgcolor: combineRgb(0,0,0)
    //                     },
    //                     steps: [
    //                         {
    //                             up: [],
    //                         }
    //                     ],
    //                     feedbacks: [{
    //                         feedbackId: "SlotSource",
    //                         options: {
    //                             slot: 'code',
    //                             sourcedd: '',
    //                             sourcename: '',
    //                         },
    //                         style: {
    //                             color: combineRgb(255, 255, 255),
    //                             bgcolor: combineRgb(160, 0, 0)
    //                         }
    //                     }]
    //                 };

                    // presets.push(toAdd);


    self.setPresetDefinitions(presets);

    return;

    
}