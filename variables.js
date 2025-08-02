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

        values[`viewer${i}_selected_viewport`] = viewer.focusedViewportIndex;
        values[`viewer${i}_audiosource`] = viewer.audioMonitorSourceName;
        values[`viewer${i}_projectorsource`] = viewer.projectorSource.ndiSource || "(None)";

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
    // let allVariables = [...self.state.slots.map(o => ({
    //     variableId: `slot_${o.code}_locked`,
    //     name: `Slot ${o.slotName} Lock Status`
    // })), ...self.state.slots.map(o => ({
    //     variableId: `slot_${o.code}`,
    //     name: `Slot ${o.slotName} Source`
    // }))]
    

	self.setVariableDefinitions(allVariables);



    for(let i = 0; i < self.state.slots.length; i++) {
        let o = self.state.slots[i];

        values[`slot_${o.code}`] = o.sourceName;
        values[`slot_${o.code}_locked`] = o.isLocked;
    }


        
        
        
    //     [
	// 	{ variableId: 'variable1', name: 'My first variable' },
	// 	{ variableId: 'variable2', name: 'My second variable' },
	// 	{ variableId: 'variable3', name: 'Another variable' },
	// ])
}
