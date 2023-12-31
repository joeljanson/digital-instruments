/* {
	"session": {
		"sequencerChainData": [
			[
				{ "name": "input", "type": "all" },
				{
					"name": "chordcreator",
					"chords": [
						{ "note": 0, "voicing": [0, 2, 4, 7, 11] },
						{ "note": 2, "voicing": [0, 2, 3, 7, 10] },
						{ "note": 4, "voicing": [0, 2, 3, 7, 10] },
						{ "note": 5, "voicing": [0, 2, 4, 7, 11] },
						{ "note": 7, "voicing": [0, 2, 4, 7, 10] },
						{ "note": 9, "voicing": [0, 2, 3, 7, 10] },
						{ "note": 11, "voicing": [0, 2, 3, 6, 10] },
						{ "note": 1, "voicing": [0, 2, 3, 6, 9] },
						{ "note": 3, "voicing": [0, 2, 3, 6, 10] },
						{ "note": 6, "voicing": [0, 2, 3, 6, 9] },
						{ "note": 8, "voicing": [0, 2, 3, 7, 10] },
						{ "note": 10, "voicing": [0, 2, 4, 7, 11] }
					]
				},
				{"name":"strummer", "range":0.5, "direction":"up"},
				{ 
					"name": "drummersequencer", 
					"length":"1m", 
					"patterns": [{ "note": "12","pattern":[
						{ "time": "0", "notes": [0] },
						{ "time": "0:0:2", "notes": [6] },
						{ "time": "0:1", "notes": [0,2] },
						{ "time": "0:1:2", "notes": [6] },
						{ "time": "0:2", "notes": [0] },
						{ "time": "0:2:2", "notes": [6] },
						{ "time": "0:3", "notes": [0,2] },
						{"time":"0:3:2", "notes":[6]},
						{"time":"0:3:3", "notes":[6]}
					]
					},{
						"note": "13",
						"pattern": [
							{ "time": "0", "notes": [0] },
							{ "time": "0:3:2", "notes": [0] }
						]
					}]
				},
				{ "name": "output", "output": "SEQUENCER_EVENT" }
			]
		],
		"instrumentChainData": [
			{ "name": "drummer"},
			{ "name": "divisions", "loopDuration": 0 , "usesBuffer":false}
		],
		"effectChainData": [
			{
				"name": "delay",
				"displayName": "Delay",
				"delayTime": 0.5,
				"bypassed": true
			},
			{ "name": "convolver", "displayName": "Conputer", "bypassed": true }
		]
	}
}
 */
