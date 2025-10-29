import Home from './pages/Home';
import MasterCovenant from './pages/MasterCovenant';
import Consultation from './pages/Consultation';
import QRGenerator from './pages/QRGenerator';
import Steganography from './pages/Steganography';
import Blockchain from './pages/Blockchain';
import SecurityTools from './pages/SecurityTools';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import NUPSLogin from './pages/NUPSLogin';
import NUPSStaff from './pages/NUPSStaff';
import NUPSOwner from './pages/NUPSOwner';
import GlyphBot from './pages/GlyphBot';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "MasterCovenant": MasterCovenant,
    "Consultation": Consultation,
    "QRGenerator": QRGenerator,
    "Steganography": Steganography,
    "Blockchain": Blockchain,
    "SecurityTools": SecurityTools,
    "Pricing": Pricing,
    "Contact": Contact,
    "NUPSLogin": NUPSLogin,
    "NUPSStaff": NUPSStaff,
    "NUPSOwner": NUPSOwner,
    "GlyphBot": GlyphBot,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};