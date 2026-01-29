module.exports = async function (self) {
    let allVariables = [];
    let values = {};

    for(let i = 0; i < self.state.current.viewers.length; i++) {
        let viewer = self.state.current.viewers[i];
        allVariables.push({
            variableId: `viewer${i}_selected_viewport`,
            name: `Viewer ${i} - Selected Viewport`
        });

        allVariables.push({
            variableId: `viewer${i}_audiosource`,
            name: `Viewer ${i} - Audio Monitor Source Name`
        });

        allVariables.push({
            variableId: `viewer${i}_projectorsource`,
            name: `Viewer ${i} - Projected Source Name`
        });

        allVariables.push({
            variableId: `viewer${i}_focusedViewportIndex`,
            name: `Viewer ${i} - Focused Viewport`
        });

        allVariables.push({
            variableId: `KVMNewMode`,
            name: `KVM New Mode`
        });

        allVariables.push({
            variableId: `PTZLockoutMode`,
            name: `PTZ Lockout Mode`
        });
    
            //fix this
    

        for (let captionsIndex = 0; captionsIndex < viewer.layout.captions.length; captionsIndex++){
            let caption = viewer.layout.captions[captionsIndex];
            allVariables.push({
                variableId: `viewer${i}_caption${captionsIndex}_code`,
                name: `Viewer ${i} - Caption ${captionsIndex} - Assigned Code`
            });
            allVariables.push({
                variableId: `viewer${i}_caption${captionsIndex}_value`,
                name: `Viewer ${i} - Caption ${captionsIndex} - Assigned Value`
            });

            values[`viewer${i}_caption${captionsIndex}_code`] = caption.code;
            values[`viewer${i}_caption${captionsIndex}_value`] = caption.text;
        }
        

        values[`viewer${i}_selected_viewport`] = viewer.focusedViewportIndex;
        values[`viewer${i}_audiosource`] = viewer.audioMonitorSourceName;
        values[`viewer${i}_projectorsource`] = viewer.projectorSource.ndiSource || "(None)";
        values[`viewer${i}_focusedViewportIndex`] = viewer.focusedViewportIndex;
        values[`viewer${i}_KVMNewMode`] = viewer.kvmMode;
        values[`viewer${i}_PTZLockoutMode`] = viewer.lockPtzIfSourceOnProgram;

        for(let vpi = 0; vpi < viewer.outputs.length; vpi++) {
            let output = viewer.outputs[vpi];
            console.log(output);

            allVariables.push({
                variableId: `viewer${i}_viewport${vpi}_source`,
                name: `Viewer ${i}, Viewport ${vpi} - Assigned Source`
            });

            allVariables.push({
                variableId: `viewer${i}_viewport${vpi}_watchdog`,
                name: `Viewer ${i}, Viewport ${vpi} - Watchdog Tripped`
            });

            values[`viewer${i}_viewport${vpi}_source`] = output.ndiSource || "(None)";
            values[`viewer${i}_viewport${vpi}_watchdog`] = output.videoWatchdogTripped;
        }
    }


    
	self.setVariableDefinitions(allVariables);
    self.setVariableValues(values);

    return;
    
}
