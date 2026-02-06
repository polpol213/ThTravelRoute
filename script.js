document.addEventListener('DOMContentLoaded', () => {
    const originSelect = document.getElementById('origin');
    const destSelect = document.getElementById('destination');
    const swapBtn = document.getElementById('swap-btn');
    const searchBtn = document.getElementById('search-btn');
    const resultsArea = document.getElementById('results-area');

    // Initialize Map
    const map = L.map('map').setView([13.7563, 100.5018], 6); // Default to Bangkok

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let routeLayerGroup = L.layerGroup().addTo(map);

    // Coordinate Database (Approximate Lat/Lng for Provinces)
    const provinceCoordinates = {
        "กรุงเทพมหานคร": [13.7563, 100.5018],
        "สมุทรปราการ": [13.5991, 100.5967],
        "นนทบุรี": [13.8591, 100.5217],
        "ปทุมธานี": [14.0208, 100.5250],
        "พระนครศรีอยุธยา": [14.3532, 100.5684],
        "อ่างทอง": [14.5896, 100.4550],
        "ลพบุรี": [14.7995, 100.6533],
        "สิงห์บุรี": [14.8936, 100.3957],
        "ชัยนาท": [15.1852, 100.1250],
        "สระบุรี": [14.5284, 100.9108],
        "ชลบุรี": [13.3611, 100.9847],
        "ระยอง": [12.6828, 101.2816],
        "จันทบุรี": [12.6100, 102.1032],
        "ตราด": [12.2428, 102.5186],
        "ฉะเชิงเทรา": [13.6904, 101.0779],
        "ปราจีนบุรี": [14.0620, 101.3768],
        "นครนายก": [14.2069, 101.2130],
        "สระแก้ว": [13.8141, 102.0722],
        "นครราชสีมา": [14.9759, 102.1000],
        "บุรีรัมย์": [14.9930, 103.1029],
        "สุรินทร์": [14.8824, 103.4937],
        "ศรีสะเกษ": [15.1186, 104.3220],
        "อุบลราชธานี": [15.2448, 104.8473],
        "ยโสธร": [15.7924, 104.1453],
        "ชัยภูมิ": [15.8063, 102.0315],
        "อำนาจเจริญ": [15.8587, 104.6258],
        "บึงกาฬ": [18.3615, 103.6468],
        "ขอนแก่น": [16.4419, 102.8359],
        "อุดรธานี": [17.4156, 102.7872],
        "เลย": [17.4860, 101.7223],
        "หนองคาย": [17.8785, 102.7420],
        "มหาสารคาม": [16.1857, 103.3015],
        "ร้อยเอ็ด": [16.0538, 103.6520],
        "กาฬสินธุ์": [16.4322, 103.5061],
        "สกลนคร": [17.1611, 104.1488],
        "นครพนม": [17.4087, 104.7794],
        "มุกดาหาร": [16.5436, 104.7235],
        "เชียงใหม่": [18.7883, 98.9853],
        "ลำพูน": [18.5756, 99.0087],
        "ลำปาง": [18.2883, 99.4928],
        "อุตรดิตถ์": [17.6201, 100.0993],
        "แพร่": [18.1446, 100.1403],
        "น่าน": [18.7832, 100.7782],
        "พะเยา": [19.1678, 99.9022],
        "เชียงราย": [19.9105, 99.8406],
        "แม่ฮ่องสอน": [19.3020, 97.9654],
        "นครสวรรค์": [15.7003, 100.0706],
        "อุทัยธานี": [15.3835, 100.0246],
        "กำแพงเพชร": [16.4828, 99.5227],
        "ตาก": [16.8837, 99.1239],
        "สุโขทัย": [17.0094, 99.8264],
        "พิษณุโลก": [16.8211, 100.2659],
        "พิจิตร": [16.4426, 100.3493],
        "เพชรบูรณ์": [16.4190, 101.1562],
        "ราชบุรี": [13.5283, 99.8135],
        "กาญจนบุรี": [14.0205, 99.5292],
        "สุพรรณบุรี": [14.4745, 100.1177],
        "นครปฐม": [13.8188, 100.0373],
        "สมุทรสาคร": [13.5475, 100.2736],
        "สมุทรสงคราม": [13.4098, 99.9977],
        "เพชรบุรี": [13.1132, 99.9392],
        "ประจวบคีรีขันธ์": [11.8384, 99.7958],
        "ชุมพร": [10.4930, 99.1800],
        "ระนอง": [9.9529, 98.6085],
        "สุราษฎร์ธานี": [9.1302, 99.3334],
        "พังงา": [8.4509, 98.5299],
        "ภูเก็ต": [7.8804, 98.3984],
        "กระบี่": [8.0855, 98.9063],
        "นครศรีธรรมราช": [8.4309, 99.9631],
        "ตรัง": [7.5645, 99.6239],
        "พัทลุง": [7.6171, 100.0717],
        "สตูล": [6.6238, 100.0674],
        "สงขลา": [7.1988, 100.5951],
        "ปัตตานี": [6.8675, 101.2501],
        "ยะลา": [6.5411, 101.2804],
        "นราธิวาส": [6.4255, 101.8253],
        "แม่สาย (เชียงราย)": [20.4335, 99.8785],
        "สะเดา (สงขลา)": [6.6384, 100.4228],
        "หนองคาย": [17.8785, 102.7420],
        "มาบตาพุด (ระยอง)": [12.7167, 101.1667],
        "อรัญประเทศ (สระแก้ว)": [13.6957, 102.5034],
        "หนองบัวลำภู": [17.2041, 102.4407],
        "วงแหวนรอบนอก": [13.6904, 100.4137], // approximate center point for ring road logic
        "บางปะอิน": [14.195, 100.615], // Refined for Bang Pa-in Interchange
        "สระบุรี": [14.520, 100.915], // Refined for Saraburi Junction
        "พระนครศรีอยุธยา": [14.340, 100.585], // Refined for Asia Road access
        "ลำตะคอง": [14.815, 101.535], // M6 Temporary Entry Point
        "ปากช่อง": [14.658, 101.401] // M6 Pak Chong Interchange (Verified for smooth snapping)
    };

    let routesData = [];
    let provincesList = [];

    // Load Data
    Promise.all([
        fetch('Route.JSON').then(res => res.json()),
        fetch('Province.JSON').then(res => res.json())
    ])
        .then(([routeData, provinceData]) => {
            routesData = routeData.routes;
            provincesList = provinceData.provinces;
            populateProvinces(provincesList);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            resultsArea.innerHTML = `<div class="placeholder-text" style="color: red;">เกิดข้อผิดพลาดในการโหลดข้อมูล (โปรดตรวจสอบไฟล์ Route.JSON และ Province.JSON)</div>`;
        });

    // Populate Select Options from Province.JSON
    function populateProvinces(provinces) {
        // Sort by Thai name
        const sortedProvinces = provinces.sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'));

        sortedProvinces.forEach(p => {
            const option1 = new Option(p.name_th, p.name_th);
            const option2 = new Option(p.name_th, p.name_th);
            originSelect.add(option1);
            destSelect.add(option2);
        });
    }

    // Swap Origin and Destination
    swapBtn.addEventListener('click', () => {
        const temp = originSelect.value;
        originSelect.value = destSelect.value;
        destSelect.value = temp;

        // Trigger animation
        const icon = swapBtn.querySelector('i');
        icon.style.transform = 'rotate(180deg) scale(1.1)';
        setTimeout(() => {
            icon.style.transform = '';
        }, 300);
    });

    // Search Routes
    searchBtn.addEventListener('click', () => {
        const origin = originSelect.value;
        const dest = destSelect.value;

        if (!origin || !dest) {
            alert('กรุณาเลือกทั้งจังหวัดเริ่มต้นและปลายทาง');
            return;
        }

        if (origin === dest) {
            alert('จังหวัดเริ่มต้นและปลายทางต้องไม่เป็นจังหวัดเดียวกัน');
            return;
        }

        findPathAndDisplay(origin, dest);
    });

    // Helper: Haversine Distance
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Build Graph from Routes
    function buildGraph(routes) {
        const graph = {};

        routes.forEach(route => {
            const provinces = route.provinces_passed;
            if (!provinces || provinces.length < 2) return;

            // Highway Preference Adjustment
            // Primary = 1.0 (Base)
            // Secondary = 1.3 (Penalty)
            // Motorway/Outer Ring Road/Expressway = 0.8 (Bonus preference)
            // Custom preference = route.preference (if specified)
            let typeMultiplier = 1.0;

            // Check for custom preference first
            if (route.preference !== undefined) {
                typeMultiplier = route.preference;
            } else if (route.type.includes('Secondary')) {
                typeMultiplier = 1.3;
            } else if (route.type.includes('Motorway') || route.type.includes('Outer Ring Road') || route.type.includes('Expressway')) {
                typeMultiplier = 0.8;
            }

            for (let i = 0; i < provinces.length - 1; i++) {
                const u = provinces[i];
                const v = provinces[i + 1];

                const coordU = provinceCoordinates[u];
                const coordV = provinceCoordinates[v];

                if (!coordU || !coordV) continue;

                // Create graph nodes
                if (!graph[u]) graph[u] = [];
                if (!graph[v]) graph[v] = [];

                // Calculate Real Distance
                const dist = getDistanceFromLatLonInKm(coordU[0], coordU[1], coordV[0], coordV[1]);

                // Effective Weight for Pathfinding (Distance * Preference)
                const weight = dist * typeMultiplier;

                // Add bi-directional edges
                graph[u].push({ node: v, weight: weight, realDist: dist, route: route });
                graph[v].push({ node: u, weight: weight, realDist: dist, route: route });
            }
        });

        return graph;
    }

    // Dijkstra Algorithm
    function dijkstra(start, end, graph) {
        const distances = {};
        const previous = {};
        const queue = new Set(); // Using Set as a simple priority queue substitute for small N

        // Initialize
        for (const node in graph) {
            distances[node] = Infinity;
            previous[node] = null;
            queue.add(node);
        }

        if (!graph[start]) return null; // Start node not in graph (isolated)

        distances[start] = 0;

        while (queue.size > 0) {
            // Find node in queue with smallest distance
            let u = null;
            let minDist = Infinity;

            for (const node of queue) {
                if (distances[node] < minDist) {
                    minDist = distances[node];
                    u = node;
                }
            }

            if (u === end) break; // Found destination
            if (minDist === Infinity) break; // Remaining nodes unreachable

            queue.delete(u);

            // Explore neighbors
            if (graph[u]) {
                for (const neighbor of graph[u]) {
                    const alt = distances[u] + neighbor.weight;
                    if (alt < distances[neighbor.node]) {
                        distances[neighbor.node] = alt;
                        previous[neighbor.node] = { node: u, route: neighbor.route };
                    }
                }
            }
        }

        // Reconstruct path
        const path = [];
        let current = end;
        if (distances[end] === Infinity) return null; // Path not found

        while (current !== null) {
            path.unshift(current);
            const prevData = previous[current];
            if (prevData) {
                current = prevData.node;
            } else {
                current = null;
            }
        }

        // Extract segments with route info
        const segments = [];
        let totalRealDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            // Find the edge info again to get the Route details
            // Note: graph[from] might have multiple routes to 'to', we should pick the one with matching weight or lowest weight
            const edge = graph[from].reduce((prev, curr) => {
                if (curr.node !== to) return prev;
                if (!prev) return curr;
                return (curr.weight < prev.weight) ? curr : prev;
            }, null);

            segments.push({
                from: from,
                to: to,
                route: edge.route,
                dist: edge.weight,
                realDist: edge.realDist
            });
            totalRealDistance += edge.realDist;
        }

        return {
            totalDistance: totalRealDistance, // Use real distance for display
            segments: segments,
            fullPath: path
        };
    }

    function findPathAndDisplay(origin, dest) {
        resultsArea.innerHTML = ''; // Clear previous results
        routeLayerGroup.clearLayers(); // Clear map

        const graph = buildGraph(routesData);
        const result = dijkstra(origin, dest, graph);

        if (!result) {
            resultsArea.innerHTML = `
                <div class="glass-card fade-in">
                    <h3 style="color: #666; text-align: center;">ไม่พบเส้นทางเชื่อมต่อระหว่างจังหวัดที่เลือก</h3>
                    <p style="text-align: center; margin-top: 10px;">อาจเป็นเพราะไม่มีข้อมูลเส้นทางหลักเชื่อมโยงในฐานข้อมูล</p>
                </div>`;
            return;
        }

        // --- Post-Processing: Group segments by Route Number ---
        const groupedSteps = [];
        if (result.segments.length > 0) {
            let currentGroup = {
                route: result.segments[0].route,
                start: result.segments[0].from,
                end: result.segments[0].to,
                distance: result.segments[0].realDist,
                path: [result.segments[0].from, result.segments[0].to]
            };

            for (let i = 1; i < result.segments.length; i++) {
                const seg = result.segments[i];
                if (seg.route.route_number === currentGroup.route.route_number) {
                    // Continue same route
                    currentGroup.end = seg.to;
                    currentGroup.distance += seg.realDist;
                    currentGroup.path.push(seg.to);
                } else {
                    // New route detected, push old group
                    groupedSteps.push(currentGroup);
                    // Start new group
                    currentGroup = {
                        route: seg.route,
                        start: seg.from, // Should match previous group end
                        end: seg.to,
                        distance: seg.realDist,
                        path: [seg.from, seg.to]
                    };
                }
            }
            groupedSteps.push(currentGroup);
        }

        // Calculate Total Time
        const speed = 90;
        const totalTimeHours = result.totalDistance / speed;
        const h = Math.floor(totalTimeHours);
        const m = Math.round((totalTimeHours - h) * 60);
        let timeStr = "";
        if (h > 0) timeStr += `${h} ชม. `;
        if (m > 0) timeStr += `${m} นาที`;
        if (timeStr === "") timeStr = "น้อยกว่า 1 นาที";


        // Display Summary Card
        const summaryCard = document.createElement('div');
        summaryCard.className = 'glass-card result-card';
        summaryCard.style.borderLeftColor = '#2EC4B6'; // Teal for "Multi-Step"

        summaryCard.innerHTML = `
            <div class="result-header">
                <h2 class="route-title" style="color: #333">สรุปเส้นทาง</h2>
            </div>
            <div class="route-meta">
                <div class="meta-item"><i class="fa-solid fa-road"></i> <span>ระยะทางรวม ~${Math.round(result.totalDistance)} กม.</span></div>
                <div class="meta-item"><i class="fa-solid fa-clock"></i> <span>เวลาเดินทาง ~${timeStr}</span></div>
            </div>
        `;
        resultsArea.appendChild(summaryCard);

        // Separate regular highways from expressways/motorways
        const regularSteps = groupedSteps.filter(s => s.route.type !== 'Expressway' && s.route.type !== 'Motorway');
        const expresswaySteps = groupedSteps.filter(s => s.route.type === 'Expressway' || s.route.type === 'Motorway');

        // Display Regular Highway Steps
        if (regularSteps.length > 0) {
            const regularHeader = document.createElement('div');
            regularHeader.className = 'glass-card';
            regularHeader.style.background = 'linear-gradient(135deg, rgba(46, 196, 182, 0.1), rgba(46, 196, 182, 0.05))';
            regularHeader.style.padding = '15px';
            regularHeader.style.marginBottom = '10px';
            regularHeader.innerHTML = '<h3 style="margin: 0; color: #2EC4B6;"><i class="fa-solid fa-road"></i> เส้นทางหลัก</h3>';
            resultsArea.appendChild(regularHeader);

            regularSteps.forEach((step, index) => {
                const stepCard = document.createElement('div');
                stepCard.className = 'glass-card result-card';
                stepCard.style.animationDelay = `${(index + 1) * 0.1}s`;

                stepCard.innerHTML = `
                    <div class="path-label" style="margin-bottom: 5px;">ช่วงที่ ${index + 1}: ${step.start} <i class="fa-solid fa-arrow-right"></i> ${step.end}</div>
                    <div class="result-header" style="margin-bottom: 0.5rem;">
                        <div class="route-badges">
                            <span class="badge badge-route">หมายเลข ${step.route.route_number}</span>
                            <span class="badge badge-type">${step.route.type}</span>
                        </div>
                    </div>
                    <h2 class="route-title" style="font-size: 1.1rem;">${step.route.name_th}</h2>
                    <div style="color: #666; font-size: 0.9rem;">ระยะทาง: ~${Math.round(step.distance)} กม.</div>
                `;
                resultsArea.appendChild(stepCard);
            });
        }

        // Display Expressway/Motorway Steps (Detailed)
        if (expresswaySteps.length > 0) {
            const expresswayHeader = document.createElement('div');
            expresswayHeader.className = 'glass-card';
            expresswayHeader.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 107, 107, 0.05))';
            expresswayHeader.style.padding = '15px';
            expresswayHeader.style.marginTop = '20px';
            expresswayHeader.style.marginBottom = '10px';
            expresswayHeader.innerHTML = '<h3 style="margin: 0; color: #ff6b6b;"><i class="fa-solid fa-highway"></i> ทางพิเศษ/มอเตอร์เวย์ที่ผ่าน</h3>';
            resultsArea.appendChild(expresswayHeader);

            expresswaySteps.forEach((step, index) => {
                const stepCard = document.createElement('div');
                stepCard.className = 'glass-card result-card motorway';
                stepCard.style.animationDelay = `${(index + expresswaySteps.length) * 0.1}s`;
                stepCard.style.borderLeft = '4px solid #ff6b6b';

                // Determine entry/exit gates
                let gateDetails = '';
                if (step.route.access_points && step.route.access_points.length > 0) {
                    const points = step.route.access_points;

                    // Determine direction
                    const routeProvinces = step.route.provinces_passed || [];
                    const startIdx = routeProvinces.indexOf(step.start);
                    const endIdx = routeProvinces.indexOf(step.end);
                    const isForward = startIdx < endIdx;

                    let entryGate, exitGate;

                    // For simple arrays (string gates)
                    if (typeof points[0] === 'string') {
                        entryGate = isForward ? points[0] : points[points.length - 1];
                        exitGate = isForward ? points[points.length - 1] : points[0];

                        // Show all gates passed
                        const gatesPassedList = isForward ? points : [...points].reverse();
                        const gatesHTML = gatesPassedList.map((gate, i) => {
                            const isEntry = i === 0;
                            const isExit = i === gatesPassedList.length - 1;
                            let icon = '📍';
                            if (isEntry) icon = '🟢';
                            if (isExit) icon = '🔴';
                            return `<div style="padding: 5px 0; border-bottom: 1px dashed rgba(0,0,0,0.1);">${icon} ${gate}</div>`;
                        }).join('');

                        gateDetails = `
                            <div style="margin-top: 15px; padding: 15px; background: rgba(255, 107, 107, 0.08); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);">
                                <div style="font-weight: bold; margin-bottom: 10px; color: #ff6b6b; font-size: 0.95rem;">
                                    <i class="fa-solid fa-route"></i> ด่านที่ผ่าน
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                                    <div style="padding: 10px; background: rgba(46, 196, 182, 0.15); border-radius: 8px; border-left: 3px solid #2EC4B6;">
                                        <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">เข้าที่</div>
                                        <div style="font-weight: bold; color: #2EC4B6;">🟢 ${entryGate}</div>
                                    </div>
                                    <div style="padding: 10px; background: rgba(230, 57, 70, 0.15); border-radius: 8px; border-left: 3px solid #e63946;">
                                        <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">ออกที่</div>
                                        <div style="font-weight: bold; color: #e63946;">🔴 ${exitGate}</div>
                                    </div>
                                </div>
                                <div style="font-size: 0.85rem; color: #555; margin-bottom: 8px; font-weight: 600;">ด่านทั้งหมดที่ผ่าน:</div>
                                <div style="font-size: 0.85rem; background: white; padding: 10px; border-radius: 6px;">
                                    ${gatesHTML}
                                </div>
                            </div>
                        `;
                    } else {
                        // For object arrays (with name/km)
                        entryGate = isForward ? points[0].name : points[points.length - 1].name;
                        exitGate = isForward ? points[points.length - 1].name : points[0].name;

                        const gatesPassedList = isForward ? points : [...points].reverse();
                        const gatesHTML = gatesPassedList.map((gate, i) => {
                            const isEntry = i === 0;
                            const isExit = i === gatesPassedList.length - 1;
                            let icon = '📍';
                            if (isEntry) icon = '🟢';
                            if (isExit) icon = '🔴';
                            const desc = gate.description ? `<div style="font-size: 0.75rem; color: #888; margin-top: 2px;">${gate.description}</div>` : '';
                            return `<div style="padding: 5px 0; border-bottom: 1px dashed rgba(0,0,0,0.1);">${icon} ${gate.name} <span style="color: #999; font-size: 0.8rem;">(กม.${gate.km})</span>${desc}</div>`;
                        }).join('');

                        gateDetails = `
                            <div style="margin-top: 15px; padding: 15px; background: rgba(255, 107, 107, 0.08); border-radius: 10px; border: 2px solid rgba(255, 107, 107, 0.3);">
                                <div style="font-weight: bold; margin-bottom: 10px; color: #ff6b6b; font-size: 0.95rem;">
                                    <i class="fa-solid fa-route"></i> ด่านที่ผ่าน
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                                    <div style="padding: 10px; background: rgba(46, 196, 182, 0.15); border-radius: 8px; border-left: 3px solid #2EC4B6;">
                                        <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">เข้าที่</div>
                                        <div style="font-weight: bold; color: #2EC4B6;">🟢 ${entryGate}</div>
                                    </div>
                                    <div style="padding: 10px; background: rgba(230, 57, 70, 0.15); border-radius: 8px; border-left: 3px solid #e63946;">
                                        <div style="font-size: 0.8rem; color: #666; margin-bottom: 3px;">ออกที่</div>
                                        <div style="font-weight: bold; color: #e63946;">🔴 ${exitGate}</div>
                                    </div>
                                </div>
                                <div style="font-size: 0.85rem; color: #555; margin-bottom: 8px; font-weight: 600;">ด่านทั้งหมดที่ผ่าน:</div>
                                <div style="font-size: 0.85rem; background: white; padding: 10px; border-radius: 6px;">
                                    ${gatesHTML}
                                </div>
                            </div>
                        `;
                    }
                }

                stepCard.innerHTML = `
                    <div class="path-label" style="margin-bottom: 8px; font-weight: 600; color: #ff6b6b;">
                        <i class="fa-solid fa-highway"></i> ${step.start} <i class="fa-solid fa-arrow-right"></i> ${step.end}
                    </div>
                    <div class="result-header" style="margin-bottom: 0.5rem;">
                        <div class="route-badges">
                            <span class="badge badge-route" style="background: #ff6b6b;">หมายเลข ${step.route.route_number}</span>
                            <span class="badge badge-type" style="background: #e63946;">${step.route.type}</span>
                        </div>
                    </div>
                    <h2 class="route-title" style="font-size: 1.15rem; color: #ff6b6b;">${step.route.name_th}</h2>
                    <div style="color: #666; font-size: 0.9rem; margin-top: 5px;">ระยะทาง: ~${Math.round(step.distance)} กม.</div>
                    ${gateDetails}
                `;
                resultsArea.appendChild(stepCard);

                // Display suggested expressways (e.g., EXAT routes within Bangkok)
                if (step.route.suggested_expressways && step.route.suggested_expressways.length > 0) {
                    step.route.suggested_expressways.forEach(suggestion => {
                        const suggestedRoute = routesData.find(r => r.route_number === suggestion.route);
                        if (!suggestedRoute) return;

                        const suggestionCard = document.createElement('div');
                        suggestionCard.className = 'glass-card result-card';
                        suggestionCard.style.animationDelay = `${(index + expresswaySteps.length + 1) * 0.1}s`;
                        suggestionCard.style.borderLeft = '4px solid #9b59b6';
                        suggestionCard.style.marginLeft = '20px';
                        suggestionCard.style.background = 'linear-gradient(135deg, rgba(155, 89, 182, 0.05), rgba(155, 89, 182, 0.02))';

                        // Build gate list for suggested route
                        let suggestedGateHTML = '';
                        if (suggestedRoute.access_points && suggestedRoute.access_points.length > 0) {
                            const points = suggestedRoute.access_points;
                            const gatesHTML = points.map((gate, i) => {
                                const gateName = typeof gate === 'string' ? gate : gate.name;
                                return `<div style="padding: 3px 0; font-size: 0.8rem; color: #666;">📍 ${gateName}</div>`;
                            }).join('');

                            suggestedGateHTML = `
                                <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.2);">
                                    <div style="font-size: 0.8rem; color: #9b59b6; font-weight: 600; margin-bottom: 5px;">ด่านที่ผ่าน:</div>
                                    ${gatesHTML}
                                </div>
                            `;
                        }

                        suggestionCard.innerHTML = `
                            <div style="font-size: 0.75rem; color: #9b59b6; font-weight: 600; margin-bottom: 5px;">
                                <i class="fa-solid fa-link"></i> ทางด่วนเชื่อมต่อ
                            </div>
                            <div class="result-header" style="margin-bottom: 0.5rem;">
                                <div class="route-badges">
                                    <span class="badge badge-route" style="background: #9b59b6;">หมายเลข ${suggestedRoute.route_number}</span>
                                    <span class="badge badge-type" style="background: #8e44ad;">${suggestedRoute.type}</span>
                                </div>
                            </div>
                            <h3 class="route-title" style="font-size: 1rem; color: #9b59b6;">${suggestedRoute.name_th}</h3>
                            <div style="color: #888; font-size: 0.85rem; margin-top: 5px; font-style: italic;">
                                <i class="fa-solid fa-info-circle"></i> ${suggestion.purpose}
                            </div>
                            ${suggestedGateHTML}
                        `;
                        resultsArea.appendChild(suggestionCard);
                    });
                }
            });
        }

        // Map Visualization (Chain OSRM calls or endpoints)
        drawMultiStepRouteOnMap(result.fullPath, groupedSteps);
    }

    async function drawMultiStepRouteOnMap(fullPath, groupedSteps) {
        if (!fullPath || fullPath.length < 2) return;

        const coordsList = fullPath.map(name => provinceCoordinates[name]).filter(c => !!c);

        if (coordsList.length < 2) return;

        // Add markers for Start, End, and Waypoints (transfer points)
        // Start Marker
        const startName = groupedSteps[0].start;
        const startCoord = provinceCoordinates[startName];
        if (startCoord) {
            L.marker(startCoord).addTo(routeLayerGroup)
                .bindPopup(`<b>เริ่มต้น</b><br>${startName}`).openPopup();
        }

        // End Marker
        const lastStep = groupedSteps[groupedSteps.length - 1];
        const endName = lastStep.end;
        const endCoord = provinceCoordinates[endName];
        if (endCoord) {
            L.marker(endCoord).addTo(routeLayerGroup)
                .bindPopup(`<b>สิ้นสุด</b><br>${endName}`);
        }

        // Middle transfer markers (points between segments)
        for (let i = 0; i < groupedSteps.length - 1; i++) {
            const transferPoint = groupedSteps[i].end;
            const transferCoord = provinceCoordinates[transferPoint];
            if (transferCoord) {
                L.circleMarker(transferCoord, { radius: 5, color: '#666' })
                    .addTo(routeLayerGroup)
                    .bindPopup(`จุดเปลี่ยนเส้นทาง: ${transferPoint}<br>เปลี่ยนเข้าสู่: ${groupedSteps[i + 1].route.name_th}`);
            }
        }

        // OSRM handles up to ~100 coordinates in URL usually, but let's stringify them
        // Note: OSRM expects {lon},{lat}
        const coordString = coordsList.map(c => `${c[1]},${c[0]}`).join(';');

        // Add Continue Straight to prevent U-turns at waypoints
        // Add Radiuses to allow snapping to nearest road (1km for waypoints, 50m for start/end)
        const rads = coordsList.map((_, idx) => (idx === 0 || idx === coordsList.length - 1) ? "50" : "1000").join(';');

        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson&continue_straight=true&radiuses=${rads}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('OSRM API Error');
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const routeGeoJSON = data.routes[0].geometry;
                const routeLayer = L.geoJSON(routeGeoJSON, {
                    style: {
                        color: 'var(--primary-color)',
                        weight: 6,
                        opacity: 0.8,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }
                }).addTo(routeLayerGroup);
                map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
            }
        } catch (error) {
            console.warn("OSRM Failed, falling back to straight lines", error);
            const polyline = L.polyline(coordsList, {
                color: '#4361ee',
                weight: 5,
                dashArray: '5, 10'
            }).addTo(routeLayerGroup);
            map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        }
    }
});
