import React, { useMemo, useState } from "react";
import { api } from "../../api/client";
import type {
  CarbonPredictorSection as CarbonPredictorSectionType,
  CarbonPredictionRequest
} from "../../api/types";

const stepTitles = ["Profile", "Home & Energy", "Travel", "Consumption", "Daily Habits"] as const;

const defaultCopy = {
  title: "EcoTrack AI",
  subtitle: "Renseignez votre mode de vie pour estimer votre empreinte carbone.",
  loadingTitle: "Analyse en cours...",
  loadingSubtitle: "Corrélation de 19 variables avec les bases carbone.",
  resultTitle: "Votre émission estimée",
  resultSubtitle:
    "Votre empreinte est 15 % inférieure à la moyenne régionale. Votre choix d’un régime vegan est votre meilleur atout.",
  buttonLabel: "Recalculer"
};

type FormState = {
  bodyType: string;
  sex: string;
  diet: string;
  showerFrequency: string;
  heatingEnergySource: string;
  transport: string;
  vehicleType: string;
  socialActivity: string;
  monthlyGroceryBill: number | null;
  airTravelFrequency: string;
  vehicleMonthlyDistanceKm: number;
  wasteBagSize: string;
  wasteBagWeeklyCount: number | null;
  tvPcHoursDaily: number;
  newClothesMonthly: number | null;
  internetHoursDaily: number;
  energyEfficiency: string;
  recycling: string;
  cookingWith: string;
};

const initialFormState: FormState = {
  bodyType: "slender",
  sex: "male",
  diet: "vegan",
  showerFrequency: "daily",
  heatingEnergySource: "electricity",
  transport: "public",
  vehicleType: "none",
  socialActivity: "never",
  monthlyGroceryBill: null,
  airTravelFrequency: "never",
  vehicleMonthlyDistanceKm: 1000,
  wasteBagSize: "small",
  wasteBagWeeklyCount: null,
  tvPcHoursDaily: 4,
  newClothesMonthly: null,
  internetHoursDaily: 6,
  energyEfficiency: "No",
  recycling: "No",
  cookingWith: "induction"
};

const formatPrediction = (value: number) =>
  Math.round(value).toLocaleString(undefined, { maximumFractionDigits: 0 });

const getDietInsight = (diet: string) => {
  switch (diet) {
    case "vegan":
      return "Votre choix d’un régime vegan est votre meilleur atout.";
    case "vegetarian":
      return "Votre régime végétarien limite les émissions.";
    case "pescatarian":
      return "Votre régime à base de poisson maintient un bon équilibre.";
    default:
      return "Votre alimentation a un impact réel sur vos émissions.";
  }
};

const CarbonPredictorSection: React.FC<{ section: CarbonPredictorSectionType }> = ({ section }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const totalSteps = stepTitles.length;
  const progress = (currentStep / totalSteps) * 100;
  const currentStepTitle = stepTitles[currentStep - 1];
  const showCarSection = formState.transport === "car";

  const insightText = useMemo(() => {
    if (prediction === null) return section.resultSubtitle ?? defaultCopy.resultSubtitle;
    const regionalAverage = 2450;
    const delta = Math.round(((prediction - regionalAverage) / regionalAverage) * 100);
    const comparison = delta === 0 ? "proche de" : delta < 0 ? "inférieure à" : "supérieure à";
    const percent = delta === 0 ? 0 : Math.abs(delta);
    const dietInsight = getDietInsight(formState.diet);

    if (delta === 0) {
      return `Votre empreinte est proche de la moyenne régionale. ${dietInsight}`;
    }

    return `Votre empreinte est ${percent}% ${comparison} la moyenne régionale. ${dietInsight}`;
  }, [prediction, formState.diet, section.resultSubtitle]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      void handleSubmission();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmission = async () => {
    setShowResult(true);
    setIsSubmitting(true);
    setPrediction(null);
    setErrorMessage(null);

    const payload: CarbonPredictionRequest = {
      bodyType: formState.bodyType,
      sex: formState.sex,
      diet: formState.diet,
      showerFrequency: formState.showerFrequency,
      heatingEnergySource: formState.heatingEnergySource,
      transport: formState.transport,
      vehicleType: showCarSection ? formState.vehicleType : "none",
      socialActivity: formState.socialActivity,
      monthlyGroceryBill: formState.monthlyGroceryBill ?? 0,
      airTravelFrequency: formState.airTravelFrequency,
      vehicleMonthlyDistanceKm: showCarSection ? formState.vehicleMonthlyDistanceKm : 0,
      wasteBagSize: formState.wasteBagSize,
      wasteBagWeeklyCount: formState.wasteBagWeeklyCount ?? 0,
      tvPcHoursDaily: formState.tvPcHoursDaily,
      newClothesMonthly: formState.newClothesMonthly ?? 0,
      internetHoursDaily: formState.internetHoursDaily,
      energyEfficiency: formState.energyEfficiency,
      recycling: formState.recycling,
      cookingWith: formState.cookingWith
    };

    try {
      const result = await api.predictCarbon(payload);
      setPrediction(result.prediction);
    } catch (error) {
      setErrorMessage("La prédiction a échoué. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormState(initialFormState);
    setPrediction(null);
    setErrorMessage(null);
    setIsSubmitting(false);
    setShowResult(false);
  };

  return (
    <section className="carbon-predictor min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {!showResult ? (
          <>
            <div className="px-8 pt-8 pb-4 bg-emerald-600 text-white">
              <h1 className="text-2xl font-bold mb-2">{section.title ?? defaultCopy.title}</h1>
              <p className="text-emerald-100 text-sm">
                {section.subtitle ?? defaultCopy.subtitle}
              </p>

              <div className="mt-6 h-1.5 w-full bg-emerald-800 rounded-full overflow-hidden">
                <div className="progress-bar h-full bg-emerald-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-[10px] uppercase tracking-widest font-semibold text-emerald-100">
                <span>
                  Step <span>{currentStep}</span> of {totalSteps}
                </span>
                <span>{currentStepTitle}</span>
              </div>
            </div>

            <form className="p-8" onSubmit={(event) => event.preventDefault()}>
              <div className={`step-content ${currentStep === 1 ? "active" : ""}`} data-step="1">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Parlez-nous de vous</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Sexe biologique</label>
                    <select
                      name="Sex"
                      value={formState.sex}
                      onChange={(event) => updateField("sex", event.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Morphologie</label>
                    <select
                      name="Body Type"
                      value={formState.bodyType}
                      onChange={(event) => updateField("bodyType", event.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="slender">Mince</option>
                      <option value="average">Moyenne</option>
                      <option value="athletic">Athlétique</option>
                      <option value="heavy">Corpulente</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-4">Préférence alimentaire</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label>
                      <input
                        type="radio"
                        name="Diet"
                        value="vegan"
                        className="hidden-radio"
                        checked={formState.diet === "vegan"}
                        onChange={(event) => updateField("diet", event.target.value)}
                      />
                      <div className="input-card p-4 rounded-2xl text-center border-gray-100 border-2">
                        <i className="fas fa-leaf text-emerald-500 mb-2 block"></i>
                        <span className="text-xs font-semibold">Vegan</span>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Diet"
                        value="vegetarian"
                        className="hidden-radio"
                        checked={formState.diet === "vegetarian"}
                        onChange={(event) => updateField("diet", event.target.value)}
                      />
                      <div className="input-card p-4 rounded-2xl text-center border-gray-100 border-2">
                        <i className="fas fa-carrot text-orange-500 mb-2 block"></i>
                        <span className="text-xs font-semibold">Végé</span>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Diet"
                        value="omnivore"
                        className="hidden-radio"
                        checked={formState.diet === "omnivore"}
                        onChange={(event) => updateField("diet", event.target.value)}
                      />
                      <div className="input-card p-4 rounded-2xl text-center border-gray-100 border-2">
                        <i className="fas fa-drumstick-bite text-red-500 mb-2 block"></i>
                        <span className="text-xs font-semibold">Viande</span>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Diet"
                        value="pescatarian"
                        className="hidden-radio"
                        checked={formState.diet === "pescatarian"}
                        onChange={(event) => updateField("diet", event.target.value)}
                      />
                      <div className="input-card p-4 rounded-2xl text-center border-gray-100 border-2">
                        <i className="fas fa-fish text-blue-500 mb-2 block"></i>
                        <span className="text-xs font-semibold">Poisson</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Activité sociale</label>
                  <select
                    name="Social Activity"
                    value={formState.socialActivity}
                    onChange={(event) => updateField("socialActivity", event.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="never">Jamais</option>
                    <option value="sometimes">Parfois</option>
                    <option value="often">Souvent</option>
                  </select>
                </div>
              </div>

              <div className={`step-content ${currentStep === 2 ? "active" : ""}`} data-step="2">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Votre logement</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Source d'énergie du chauffage</label>
                    <select
                      name="Heating Energy Source"
                      value={formState.heatingEnergySource}
                      onChange={(event) => updateField("heatingEnergySource", event.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200"
                    >
                      <option value="electricity">Électricité</option>
                      <option value="natural gas">Gaz naturel</option>
                      <option value="coal / wood">Charbon / Bois</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Énergie de cuisson</label>
                    <select
                      name="Cooking_With"
                      value={formState.cookingWith}
                      onChange={(event) => updateField("cookingWith", event.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200"
                    >
                      <option value="induction">Induction / Électrique</option>
                      <option value="gas">Gaz</option>
                      <option value="microwave">Surtout micro-ondes</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Efficacité énergétique</label>
                      <select
                        name="Energy efficiency"
                        value={formState.energyEfficiency}
                        onChange={(event) => updateField("energyEfficiency", event.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200"
                      >
                        <option value="No">Peu efficace</option>
                        <option value="Sometimes">Standard</option>
                        <option value="Yes">Très efficace</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Fréquence des douches</label>
                      <select
                        name="How Often Shower"
                        value={formState.showerFrequency}
                        onChange={(event) => updateField("showerFrequency", event.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200"
                      >
                        <option value="daily">Tous les jours</option>
                        <option value="twice a day">Deux fois par jour</option>
                        <option value="less often">Moins souvent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`step-content ${currentStep === 3 ? "active" : ""}`} data-step="3">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Transports</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-4">Transport principal</label>
                    <div className="grid grid-cols-3 gap-3">
                      <label>
                        <input
                          type="radio"
                          name="Transport"
                          value="public"
                          className="hidden-radio"
                          checked={formState.transport === "public"}
                          onChange={(event) => updateField("transport", event.target.value)}
                        />
                        <div className="input-card p-4 rounded-2xl text-center border-gray-100 border-2 flex flex-col items-center gap-2">
                          <i className="fas fa-bus text-blue-500"></i>
                          <span className="text-xs font-semibold">Public</span>
                        </div>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="Transport"
                          value="car"
                          className="hidden-radio"
                          checked={formState.transport === "car"}
                          onChange={(event) => updateField("transport", event.target.value)}
                        />
                        <div className="input-card p-4 rounded-2xl text-center border-gray-100 border-2 flex flex-col items-center gap-2">
                          <i className="fas fa-car text-emerald-500"></i>
                          <span className="text-xs font-semibold">Voiture</span>
                        </div>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="Transport"
                          value="walk"
                          className="hidden-radio"
                          checked={formState.transport === "walk"}
                          onChange={(event) => updateField("transport", event.target.value)}
                        />
                        <div className="input-card p-4 rounded-2xl text-center border-gray-100 border-2 flex flex-col items-center gap-2">
                          <i className="fas fa-walking text-orange-500"></i>
                          <span className="text-xs font-semibold">Marche/Vélo</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div
                    className={`p-4 bg-gray-50 rounded-2xl space-y-4 border border-dashed border-gray-300 ${
                      showCarSection ? "" : "hidden"
                    }`}
                  >
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type de véhicule</label>
                      <select
                        name="Vehicle Type"
                        value={formState.vehicleType}
                        onChange={(event) => updateField("vehicleType", event.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-gray-200"
                      >
                        <option value="none">Sélectionner</option>
                        <option value="petrol">Essence</option>
                        <option value="diesel">Diesel</option>
                        <option value="hybrid">Hybride</option>
                        <option value="electric">Électrique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Distance mensuelle : <span>{formState.vehicleMonthlyDistanceKm}</span> km
                      </label>
                      <input
                        type="range"
                        name="Vehicle Monthly Distance Km"
                        min={0}
                        max={5000}
                        step={100}
                        value={formState.vehicleMonthlyDistanceKm}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        onChange={(event) =>
                          updateField("vehicleMonthlyDistanceKm", Number.parseInt(event.target.value, 10))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Fréquence des vols (par an)
                    </label>
                    <select
                      name="Frequency of Traveling by Air"
                      value={formState.airTravelFrequency}
                      onChange={(event) => updateField("airTravelFrequency", event.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200"
                    >
                      <option value="never">Jamais</option>
                      <option value="rarely">Rarement (1-2)</option>
                      <option value="frequently">Souvent (3-10)</option>
                      <option value="very frequently">Très souvent (10+)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`step-content ${currentStep === 4 ? "active" : ""}`} data-step="4">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Consommation & Déchets</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Budget courses mensuel ($)
                    </label>
                    <input
                      type="number"
                      name="Monthly Grocery Bill"
                      placeholder="ex. 400"
                      value={formState.monthlyGroceryBill ?? ""}
                      onChange={(event) =>
                        updateField(
                          "monthlyGroceryBill",
                          event.target.value === "" ? null : Number.parseFloat(event.target.value)
                        )
                      }
                      className="w-full p-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Taille des sacs</label>
                      <select
                        name="Waste Bag Size"
                        value={formState.wasteBagSize}
                        onChange={(event) => updateField("wasteBagSize", event.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200"
                      >
                        <option value="small">Petit</option>
                        <option value="medium">Moyen</option>
                        <option value="large">Grand</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Nombre par semaine</label>
                      <input
                        type="number"
                        name="Waste Bag Weekly Count"
                        placeholder="0"
                        value={formState.wasteBagWeeklyCount ?? ""}
                        onChange={(event) =>
                          updateField(
                            "wasteBagWeeklyCount",
                            event.target.value === "" ? null : Number.parseFloat(event.target.value)
                          )
                        }
                        className="w-full p-3 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                    <span className="text-sm font-medium text-emerald-800">Recyclez-vous ?</span>
                    <select
                      name="Recycling"
                      value={formState.recycling}
                      onChange={(event) => updateField("recycling", event.target.value)}
                      className="p-2 bg-white rounded-lg border border-emerald-200 text-sm"
                    >
                      <option value="No">Non</option>
                      <option value="Yes">Oui</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`step-content ${currentStep === 5 ? "active" : ""}`} data-step="5">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Habitudes quotidiennes</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Heures TV / PC par jour : <span>{formState.tvPcHoursDaily}</span>h
                    </label>
                    <input
                      type="range"
                      name="How Long TV PC Daily Hour"
                      min={0}
                      max={24}
                      value={formState.tvPcHoursDaily}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      onChange={(event) =>
                        updateField("tvPcHoursDaily", Number.parseInt(event.target.value, 10))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Heures Internet par jour : <span>{formState.internetHoursDaily}</span>h
                    </label>
                    <input
                      type="range"
                      name="How Long Internet Daily Hour"
                      min={0}
                      max={24}
                      value={formState.internetHoursDaily}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      onChange={(event) =>
                        updateField("internetHoursDaily", Number.parseInt(event.target.value, 10))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Nouveaux vêtements (mensuel)
                    </label>
                    <input
                      type="number"
                      name="How Many New Clothes Monthly"
                      placeholder="0"
                      value={formState.newClothesMonthly ?? ""}
                      onChange={(event) =>
                        updateField(
                          "newClothesMonthly",
                          event.target.value === "" ? null : Number.parseFloat(event.target.value)
                        )
                      }
                      className="w-full p-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`px-6 py-3 text-gray-400 font-semibold hover:text-gray-600 transition-colors ${
                    currentStep === 1 ? "invisible" : "visible"
                  }`}
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                >
                  {currentStep === totalSteps ? "Calculer l'empreinte" : "Suivant"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div id="resultView" className="p-8 text-center animate-in fade-in duration-500">
            {isSubmitting ? (
              <div>
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">
                  {section.loadingTitle ?? defaultCopy.loadingTitle}
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  {section.loadingSubtitle ?? defaultCopy.loadingSubtitle}
                </p>
              </div>
            ) : errorMessage ? (
              <div>
                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-triangle-exclamation text-3xl text-rose-500"></i>
                </div>
                <h3 className="text-gray-500 font-semibold uppercase tracking-widest text-xs">Erreur de prédiction</h3>
                <p className="text-gray-600 mb-8 px-4">{errorMessage}</p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-cloud text-3xl text-emerald-600"></i>
                </div>
                <h3 className="text-gray-500 font-semibold uppercase tracking-widest text-xs">
                  {section.resultTitle ?? defaultCopy.resultTitle}
                </h3>
                <div className="text-5xl font-black text-gray-800 my-2">
                  <span>{prediction !== null ? formatPrediction(prediction) : "-"}</span>
                  <span className="text-xl">kg/CO2</span>
                </div>
                <p className="text-gray-600 mb-8 px-4">{insightText}</p>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  {section.buttonLabel ?? defaultCopy.buttonLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CarbonPredictorSection;
