# convert_safe.py
import re

# === CONFIG ===
USER_ID = "1cf3cb41-6020-4251-adfc-8a8ad0268258"  # Replace with your user ID
INPUT_FILE = "zzz_data.sql"       # Your original dump
OUTPUT_FILE = "zzz_converted.sql" # New SQL output

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

converted_lines = []

for line in lines:
    # Artifact Itself
    if 'INSERT INTO public."Drive_Disc"' in line:
        line = line.replace('public."Drive_Disc"', "zzz_t3_drive_disc")
        # Column names
        line = line.replace(
            '("ID", "Set", "Slot", "Main_Stat", "Number_of_substat", "Percent_ATK", "Percent_HP", "Percent_DEF", "ATK", "HP", "DEF", "PEN", "AP", "Crit_Rate", "Crit_DMG", "Where_got_it", "Score", "CreateDate")',
            '("id", "userId", "set", "type", "mainStat", "numberOfSubstat", "percentATK", "percentHP", "percentDEF", "atk", "hp", "def", "pen", "ap", "critRate", "critDMG", "whereGotIt", "score", "createDate")'
        )
        # Inject userId only in VALUES
        line = re.sub(r'\(\s*(\d+),', fr"(\1, '{USER_ID}',", line)
    # Artifact Leveling
    elif 'INSERT INTO public."Drive_Disc_leveling"' in line:
        line = line.replace('public."Drive_Disc_leveling"', "zzz_t3_drive_disc_leveling")
        line = line.replace(
            '("ID", "L_HP", "L_ATK", "L_DEF", "L_Percent_HP", "L_Percent_ATK", "L_Percent_DEF", "L_AP", "L_PEN", "L_Crit_Rate", "L_Crit_DMG", "Added_substat", "CreateDate", "LastAdded")',
            '("id", "lHP", "lATK", "lDEF", "lPercentHP", "lPercentATK", "lPercentDEF", "lAP", "lPEN", "lCritRate", "lCritDMG", "addedSubstat", "createDate", "lastAdded")'
        )
    converted_lines.append(line)

# Write new SQL
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.writelines(converted_lines)

print(f"✅ Converted SQL saved to {OUTPUT_FILE}")
