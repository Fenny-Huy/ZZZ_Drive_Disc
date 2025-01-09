from datetime import datetime

def generate_artifact_itself_queries(input_file, output_file):
    """
    Generate SQL queries for the updated 'Artifact itself' table with the 'CreateDate' field.

    Args:
        input_file (str): Path to the file containing artifact data.
        output_file (str): Path to the file where the SQL queries will be written.
    """
    # Define default date for missing CreateDate values
    default_date = "2024-12-10"

    # Read and process the input file
    queries = []
    with open(input_file, "r") as file:
        for line in file:
            values = line.strip().split(",")
            
            # Parse individual fields
            id_ = int(values[0])
            set_ = values[1].strip('"')
            slot_ = values[2].strip('"')
            main_stat = values[3].strip('"')
            main_stat_mapping = {
                "%PEN Ratio": "PEN Ratio",
                "Anomaly Proficiency": "AP",
                "Anomaly Mastery": "AM"
            }
            if main_stat in main_stat_mapping:
                main_stat = main_stat_mapping[main_stat]
            
            number_of_substats = int(values[4])
            substats = [int(values[i]) for i in range(5, 15)]
            where_got_it = values[15].strip('"')
            score = values[16].strip('"')

            # Parse CreateDate or use default
            if len(values) > 17 and values[17]:
                create_date_str = values[17].split(" ")[0]  # Extract date part only
                create_date = create_date_str
            else:
                create_date = default_date

            # Create SQL query
            query = (
                f"INSERT INTO `Drive Disc` (`ID`, `Set`, `Slot`, `Main Stat`, `Number of substat`, "
                f"`%ATK`, `%HP`, `%DEF`, `ATK`, `HP`, `DEF`, `PEN`, `AP`, `Crit Rate`, `Crit DMG`, "
                f"`Where got it`, `Score`, `CreateDate`) VALUES ("
                f"{id_}, \"{set_}\", '{slot_}', '{main_stat}', {number_of_substats}, "
                f"{', '.join(map(str, substats))}, '{where_got_it}', '{score}', '{create_date}');"
            )
            queries.append(query)

    # Write queries to the output file
    with open(output_file, "w") as file:
        for query in queries:
            file.write(query + "\n")

    print(f"SQL queries have been written to '{output_file}' successfully.")

# Example usage
input_file = "drive_disc.txt"  # Path to the artifact data text file
output_file = "drive_disc_queries.sql"  # Path to the output SQL file
generate_artifact_itself_queries(input_file, output_file)
