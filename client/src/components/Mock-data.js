import grue1 from           "../images/grue1.jpg";
import grue2 from           "../images/grue2.jpg";
import grue3 from           "../images/grue3.png";
import bulldozer1 from      "../images/bulldozer1.jpg";
import tractopelle1 from    "../images/tractopelle1.jpg";


export const parts = [
    {id: "19385", category: "Transmission",  manufacturer: "Dae Gun",    reference:"TMS36", sold: true},
    {id: "79276", category: "Transmission",  manufacturer: "Dae Gun",    reference:"TMS36", sold: true},
    {id: "72649", category: "Transmission",  manufacturer: "Dae Gun",    reference:"TMX30", sold: true},
    {id: "09154", category: "Vérin",         manufacturer: "CWA",        reference:"V900",  sold: true},
    {id: "18734", category: "Vérin",         manufacturer: "CWA",        reference:"V900",  sold: true},
    {id: "19845", category: "Vérin",         manufacturer: "CWA",        reference:"Vt43",  sold: true},
    {id: "78594", category: "Vérin",         manufacturer: "CWA",        reference:"Vt67",  sold: true},
    {id: "63948", category: "Vérin",         manufacturer: "CWA",        reference:"Vt22",  sold: false},
    {id: "98455", category: "Boulon",        manufacturer: "M100",       reference:"TMS36", sold: true},
    {id: "99814", category: "Boulon",        manufacturer: "M320",       reference:"TMS36", sold: true},
    {id: "98143", category: "Boulon",        manufacturer: "M320",       reference:"TMS36", sold: true},
    {id: "91548", category: "Boulon",        manufacturer: "M25",        reference:"TMS36", sold: true}
]


export const equipments = [
    {id: "62038", category: "Grue",          manufacturer: "Caterpillar",    model: "GR900C"},
    {id: "01647", category: "Grue",          manufacturer: "Komatsu",        model: "KOM2"},
    {id: "36184", category: "Grue",          manufacturer: "JCB",            model: "aJCB2017"},
    {id: "53985", category: "Bulldozer",     manufacturer: "Manitou",        model: "443b"},
    {id: "51947", category: "Tractopelle",   manufacturer: "Caterpillar",    model: "TracEx"}
]

export const equipmentsDetails = [
    {equipmentId: "62038", description: "Chantier Bouygues Grand Paris", photo: grue1},
    {equipmentId: "01647", description: "Chantier village JO 2024", photo: grue2},
    {equipmentId: "36184", description: "Chantier village JO 2024", photo: grue3},
    {equipmentId: "53985", description: "Chantier Bouygues Grand Paris", photo: bulldozer1},
    {equipmentId: "51947", description: "Chantier Bouygues Grand Paris", photo: tractopelle1},
]

export const assemblies = [
    {equipmentId: "62038", parts: ["19385", "09154", "98455"]},
    {equipmentId: "01647", parts: ["79276", "18734", "99814"]},
    {equipmentId: "36184", parts: ["72649", "19845", "98143"]},
    {equipmentId: "53985", parts: ["78594"]},
    {equipmentId: "51947", parts: ["91548"]}
]

export const operations = [
    {category: "Installation", partId: "19385", equipmentId: "62038", description: "Installation de la pièce dans l'équipement", date:"01/01/2022"},
    {category: "Installation", partId: "79276", equipmentId: "01647", description: "Installation de la pièce dans l'équipement", date:"02/02/2022"},
    {category: "Installation", partId: "72649", equipmentId: "36184", description: "Installation de la pièce dans l'équipement", date:"03/03/2022"},
    {category: "Installation", partId: "09154", equipmentId: "62038", description: "Installation de la pièce dans l'équipement", date:"04/04/2022"},
    {category: "Installation", partId: "18734", equipmentId: "01647", description: "Installation de la pièce dans l'équipement", date:"05/05/2022"},
    {category: "Installation", partId: "19845", equipmentId: "36184", description: "Installation de la pièce dans l'équipement", date:"06/06/2022"},
    {category: "Installation", partId: "78594", equipmentId: "53985", description: "Installation de la pièce dans l'équipement", date:"07/07/2022"},
    {category: "Installation", partId: "98455", equipmentId: "62038", description: "Installation de la pièce dans l'équipement", date:"08/08/2022"},
    {category: "Installation", partId: "99814", equipmentId: "01647", description: "Installation de la pièce dans l'équipement", date:"09/09/2022"},
    {category: "Installation", partId: "98143", equipmentId: "36184", description: "Installation de la pièce dans l'équipement", date:"10/10/2022"},
    {category: "Installation", partId: "91548", equipmentId: "51947", description: "Installation de la pièce dans l'équipement", date:"11/11/2022"},
    {category: "Maintenance", partId: "19385", equipmentId: "62038", description: "Révision de la pièce", date:"12/09/2022"}
]