#!/usr/bin/env python3
"""Approximate phone number location lookup.

This script uses phone number metadata to get the country/region for a mobile number.
It cannot determine an exact GPS location from the phone number alone.
"""

import sys
from typing import Optional, Tuple

import phonenumbers
from phonenumbers import carrier, geocoder, timezone

# Approximate country centroid coordinates for common regions.
# Phone numbers do not carry exact GPS coordinates; this map only gives a rough center point for the country.
COUNTRY_CENTROIDS = {
    "US": (39.8283, -98.5795),
    "CA": (56.1304, -106.3468),
    "GB": (55.3781, -3.4360),
    "AU": (-25.2744, 133.7751),
    "IN": (20.5937, 78.9629),
    "DE": (51.1657, 10.4515),
    "FR": (46.2276, 2.2137),
    "BR": (-14.2350, -51.9253),
    "JP": (36.2048, 138.2529),
    "CN": (35.8617, 104.1954),
    "RU": (61.5240, 105.3188),
    "ZA": (-30.5595, 22.9375),
}


def get_approximate_coordinates(region: str) -> Optional[Tuple[float, float]]:
    return COUNTRY_CENTROIDS.get(region)


def lookup_mobile_number(number_text: str) -> dict:
    try:
        parsed = phonenumbers.parse(number_text, None)
    except phonenumbers.NumberParseException as exc:
        raise ValueError(f"Invalid phone number: {exc}") from exc

    if not phonenumbers.is_valid_number(parsed):
        raise ValueError("The parsed phone number is not valid.")

    region = phonenumbers.region_code_for_number(parsed)
    carrier_name = carrier.name_for_number(parsed, "en") or "Unknown"
    location_description = geocoder.description_for_number(parsed, "en") or "Unknown"
    time_zones = timezone.time_zones_for_number(parsed)

    coords = get_approximate_coordinates(region) if region else None

    return {
        "input": number_text,
        "e164": phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164),
        "international": phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL),
        "national": phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL),
        "region": region,
        "carrier": carrier_name,
        "location_description": location_description,
        "time_zones": list(time_zones),
        "approximate_coordinates": coords,
    }


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python phone_geo_lookup.py <phone-number>")
        print("Example: python phone_geo_lookup.py +14155552671")
        sys.exit(1)

    number_text = sys.argv[1]
    try:
        result = lookup_mobile_number(number_text)
    except ValueError as exc:
        print(f"Error: {exc}")
        sys.exit(1)

    print("Phone number metadata:")
    print(f"  Input: {result['input']}")
    print(f"  E.164: {result['e164']}")
    print(f"  International: {result['international']}")
    print(f"  National: {result['national']}")
    print(f"  Region: {result['region']}")
    print(f"  Carrier: {result['carrier']}")
    print(f"  Location description: {result['location_description']}")
    print(f"  Time zones: {', '.join(result['time_zones']) if result['time_zones'] else 'Unknown'}")

    if result["approximate_coordinates"]:
        lat, lon = result["approximate_coordinates"]
        print(f"  Approximate country centroid: {lat}, {lon}")
    else:
        print("  Approximate coordinates: unavailable for this country code")

    print("\nNote: A phone number alone cannot provide exact GPS coordinates. This script only gives an approximate location based on number metadata.")


if __name__ == "__main__":
    main()

