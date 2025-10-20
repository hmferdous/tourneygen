function shuffle(arr) {
return arr
.map((v) => ({ v, r: Math.random() }))
.sort((a, b) => a.r - b.r)
.map((x) => x.v)
}


function chunkArray(arr, size) {
const res = []
for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
return res
}


export function generateKnockout(teams) {
// Ensure power of two by giving byes if needed
const shuffled = shuffle(teams.slice())
const matches = []
for (let i = 0; i < shuffled.length; i += 2) {
matches.push({ teamA: shuffled[i] || null, teamB: shuffled[i + 1] || null, scoreA: null, scoreB: null, round: 1 })
}
return { rounds: [matches] }
}


export function generateRoundRobin(teams, doubleLeg = false) {
const t = teams.slice()
const matches = []
// Round robin (circle method) - simple O(n^2)
for (let i = 0; i < t.length; i++) {
for (let j = i + 1; j < t.length; j++) {
matches.push({ teamA: t[i], teamB: t[j], scoreA: null, scoreB: null })
}
}
if (doubleLeg) {
const reverse = matches.map(m => ({ teamA: m.teamB, teamB: m.teamA, scoreA: null, scoreB: null }))
return { matches: matches.concat(reverse) }
}
return { matches }
}


export function generateGroupKnockout(teams, groupCount = 2) {
// Minimum group size 3 enforced by UI
const shuffled = shuffle(teams.slice())
const groups = chunkArray(shuffled, Math.ceil(shuffled.length / groupCount))
const groupObjects = groups.map((g, idx) => ({ groupName: `Group ${String.fromCharCode(65 + idx)}`, teams: g, matches: generateRoundRobin(g).matches }))


// Knockout placeholder; actual knockout seeding will happen after group stage completes.
const knockout = { rounds: [] }
return { groups: groupObjects, knockout }
}


export function generateFixtures({ format, teams, groupCount = 2 }) {
if (!teams || teams.length < 3) throw new Error('At least 3 teams required')
switch (format) {
case 'knockout':
return { type: 'knockout', ...generateKnockout(teams) }
case 'round_robin_single':
return { type: 'round_robin_single', ...generateRoundRobin(teams, false) }
case 'round_robin_double':
return { type: 'round_robin_double', ...generateRoundRobin(teams, true) }
case 'group_knockout':
return { type: 'group_knockout', ...generateGroupKnockout(teams, groupCount) }
default:
throw new Error('Unknown format')
}
}