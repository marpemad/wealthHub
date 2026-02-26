import requests
from bs4 import BeautifulSoup
from typing import Optional
from datetime import datetime
import logging
from models import PriceData
from utils import format_datetime_iso

logger = logging.getLogger(__name__)

class FundScraper:
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    @staticmethod
    def fetch_fund_price(isin: str, asset_name: str, asset_id: str) -> Optional[PriceData]:
        # URL de FT Markets para Fondos
        url = f"https://markets.ft.com/data/funds/tearsheet/summary?s={isin}:EUR"
        
        try:
            logger.info(f"Scrapeando FT para {asset_name} ({isin})")
            response = requests.get(url, headers=FundScraper.HEADERS, timeout=20)
            
            if response.status_code != 200:
                logger.error(f"FT respondió con status {response.status_code}")
                return None

            soup = BeautifulSoup(response.text, "html.parser")
            
            # Buscamos en los selectores conocidos de FT
            price_element = None
            
            # Selector 1: El valor principal del Tearsheet
            price_element = soup.find("span", {"class": "mod-ui-data-list__value"})
            
            # Selector 2: Metadatos (a veces el HTML visible cambia pero esto no)
            if not price_element:
                meta_price = soup.find("meta", {"itemprop": "price"})
                if meta_price:
                    price_val = meta_price.get("content")
                    return FundScraper._create_price_data(asset_id, asset_name, isin, price_val)

            if price_element:
                price_text = price_element.text.strip().replace(",", "")
                return FundScraper._create_price_data(asset_id, asset_name, isin, price_text)

            logger.warning(f"No se encontró precio para {isin} en FT")
            return None

        except Exception as e:
            logger.error(f"Error en scraper de {isin}: {e}")
            return None

    @staticmethod
    def _create_price_data(asset_id, name, isin, price_str):
        try:
            return PriceData(
                assetId=asset_id,
                assetName=name,
                isin=isin,
                price=round(float(price_str), 4),
                currency="EUR",
                fetchedAt=format_datetime_iso(datetime.now()),
                source="ft_markets"
            )
        except:
            return None