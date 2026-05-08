// Подключаем кабель хука
import { useWaterData } from '../hooks/useWaterData';
import MobileDashboard from '../components/MobileDashboard';

export default function Dashboard() {
  // Достаем все из хука
  const {
    appData,
    currentWater,
    goalWater,
    handleUpdateProfile,
    handleAddDrink,
    handleSaveFavorite,
    handleDeleteLog,
    handleDeleteFavorite
  } = useWaterData();

  return (
      <MobileDashboard 
            appData={appData}
            currentWater={currentWater}
            goalWater={goalWater}
            handleUpdateProfile={handleUpdateProfile}
            handleAddDrink={handleAddDrink}
            handleSaveFavorite={handleSaveFavorite}
            handleDeleteLog={handleDeleteLog}
            handleDeleteFavorite={handleDeleteFavorite}
        />
    );
}