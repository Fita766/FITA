'use client'
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { setSignature } from '@/libs/signature';
import { setExpertise } from '@/libs/expertise';
// import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook

// Importation du provider Auth0
import Auth0ProviderWrapper from "./Auth0ProviderWrapper";
import startSearch from "@/utils/serverAction";
import csvParse from "@/utils/downloadCSV";

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const [showDownloadButton, setShowDownloadButton] = useState(false); // Nouvel état pour le bouton de téléchargement
  const [launch, setLaunch] = useState(false); // Nouvel état pour le bouton de téléchargement
  const [datas, setDatas] = useState(undefined)
  // Auth0 hook pour la gestion de l'utilisateur
  // const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const handleSearchChange = (event) => setSearchValue(event.target.value);
  const handleCheckboxChange = (event) => setSelectedOption(event.target.value);
  const handleDropdownChange = (event) => setSelectedDropdownValue(event.target.value);

  const verifierUrl = (url) => /^https:\/\/www\.linkedin\.com\/search\/results\/[a-zA-Z]/.test(url);

  const handleClick = useCallback(async () => {
    if (!searchValue || !selectedDropdownValue || !selectedOption) return;
    if (!verifierUrl(searchValue)) return;

    setSignature(selectedDropdownValue);
    setExpertise(selectedOption);
    setLaunch(true)

    const values = await startSearch(searchValue)
    setShowDownloadButton(true);
    setDatas(values)
    
  }, [searchValue, selectedOption, selectedDropdownValue, router]);

  // Fonction pour télécharger le fichier XLS généré
  const handleDownloadXLS = async () => {
    if (datas) {
      csvParse(
      {
        'first_name': 'first_name',
        email: 'email',
      },
      datas,
      "Fita-Prospection-Liste",
    );
      
    }
  };

  // if (isLoading) {
  //   return <div style={{ color: "white" }}>Chargement...</div>; // Affiche un message de chargement
  // }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="card">
  //       <div className="card2">
  //         <h4>Connexion</h4>
  //         <button className="button" onClick={() => loginWithRedirect()}>Se connecter</button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div style={{ color: 'white' }}>
      {/* <h1>Bienvenue {user.name}</h1> */}
      {/* <button className="button" onClick={() => logout()}>Se déconnecter</button> */}
      
      {!showDownloadButton ? ( // Affiche le formulaire ou le bouton selon l'état
        <div className="card">
          <div className="card2">
            <h4>Prospection Automatique</h4>
            <input
              type="text"
              className="input"
              placeholder="Url de votre recherche LinkedIn"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <i className="input-icon uil uil-at"></i>
            <br />
            <label>
              <input
                type="checkbox"
                value="Data"
                checked={selectedOption === "Data"}
                onChange={handleCheckboxChange}
              />
              Data
            </label>
            <label>
              <input
                type="checkbox"
                value="Devops"
                checked={selectedOption === "Devops"}
                onChange={handleCheckboxChange}
              />
              Devops
            </label>
            <label>
              <input
                type="checkbox"
                value="Support Utilisateur"
                checked={selectedOption === "Support Utilisateur"}
                onChange={handleCheckboxChange}
              />
              Support Utilisateur
            </label>
            <br />
            <select
              value={selectedDropdownValue}
              onChange={handleDropdownChange}
              className="input"
            >
              <option value="">Sélectionnez un nom </option>
              <option value="Reigner">Hubert REIGNER</option>
              <option value="Aboulhadid">Ahmed ABOULHADID</option>
              <option value="Nouet">Charles NOUET</option>
            </select>
            {!launch && ( <button className="button" onClick={handleClick}>
              Envoyer la recherche
            </button>)}
          </div>
        </div>
      ) : (
        <button className="button" onClick={handleDownloadXLS}>
          Enregistrer le fichier XLS
        </button>
      )}
    </div>
  );
};

// Enveloppe le composant Search avec le Auth0ProviderWrapper
const SearchPage = () => {
  return (
    // <Auth0ProviderWrapper>
      <Search />
    // </Auth0ProviderWrapper>
  );
};

export default SearchPage;
