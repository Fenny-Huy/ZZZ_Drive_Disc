from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pymysql
from typing import List, Optional
import logging




# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



# Database connection settings
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "Fennik123@"
DB_NAME = "zzztest"

# FastAPI app initialization
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # URL of React application
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db_connection():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    try:
        yield connection
    finally:
        connection.close()

# Data model for artifacts
class Artifact(BaseModel):
    id: int
    set: str
    type: str
    main_stat: str
    number_of_substats: int
    atk_percent: int
    hp_percent: int
    def_percent: int
    atk: int
    hp: int
    defense: int
    pen: int
    ap: int
    crit_rate: int
    crit_dmg: int
    where_got_it: str
    score: str

# Data model for artifact leveling
class ArtifactLeveling(BaseModel):
    id: int
    L_HP: int = 0
    L_ATK: int = 0
    L_DEF: int = 0
    L_HP_per: int = 0
    L_ATK_per: int = 0
    L_DEF_per: int = 0
    L_AP: int = 0
    L_PEN: int = 0
    L_CritRate: int = 0
    L_CritDMG: int = 0
    addedSubstat: str = ""


# API endpoint to fetch all artifacts
@app.get("/genshinartifacts/", response_model=List[Artifact])
def get_artifacts(db: pymysql.connections.Connection = Depends(get_db_connection)):
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM `Drive Disc`")
        rows = cursor.fetchall()

        # Convert rows to a list of dicts
        artifacts = [
            {
                "id": row[0],
                "set": row[1],
                "type": row[2],
                "main_stat": row[3],
                "number_of_substats": row[4],
                "atk_percent": row[5],
                "hp_percent": row[6],
                "def_percent": row[7],
                "atk": row[8],
                "hp": row[9],
                "defense": row[10],
                "pen": row[11],
                "ap": row[12],
                "crit_rate": row[13],
                "crit_dmg": row[14],
                "where_got_it": row[15],
                "score": row[16],
            }
            for row in rows
        ]
    return artifacts

# API endpoint to create a new artifact
@app.post("/genshinartifacts/")
def create_artifact(artifact: Artifact, db: pymysql.connections.Connection = Depends(get_db_connection)):
    # Construct the SQL query dynamically
    query = f"""
        INSERT INTO `Drive Disc` (
            `Set`, `Slot`, `Main Stat`, `Number of substat`, `%ATK`, `%HP`, `%DEF`,
            `ATK`, `HP`, `DEF`, `PEN`, `AP`, `Crit Rate`, `Crit DMG`, `Where got it`, `Score`
        ) VALUES (
            "{artifact.set}", '{artifact.type}', '{artifact.main_stat}', {artifact.number_of_substats},
            {artifact.atk_percent}, {artifact.hp_percent}, {artifact.def_percent},
            {artifact.atk}, {artifact.hp}, {artifact.defense}, {artifact.pen}, {artifact.ap},
            {artifact.crit_rate}, {artifact.crit_dmg}, '{artifact.where_got_it}', '{artifact.score}'
        )
    """

    # Execute the query
    with db.cursor() as cursor:
        cursor.execute(query)
        db.commit()
    return {"message": "Artifact created successfully"}





# API endpoint to search for artifacts
@app.get("/search_artifacts/", response_model=List[Artifact])
def search_artifacts(
    set: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    main_stat: Optional[str] = Query(None),
    number_of_substats: Optional[int] = Query(None),
    atk_percent: Optional[int] = Query(None),
    hp_percent: Optional[int] = Query(None),
    def_percent: Optional[int] = Query(None),
    atk: Optional[int] = Query(None),
    hp: Optional[int] = Query(None),
    defense: Optional[int] = Query(None),
    pen: Optional[int] = Query(None),
    ap: Optional[int] = Query(None),
    crit_rate: Optional[int] = Query(None),
    crit_dmg: Optional[int] = Query(None),
    where_got_it: Optional[str] = Query(None),
    score: Optional[str] = Query(None),
    db: pymysql.connections.Connection = Depends(get_db_connection)
):
    query = "SELECT * FROM `Drive Disc` WHERE 1=1"
    if set:
        query += f' AND `Set` = "{set}"'
    if type:
        query += f" AND `Slot` = '{type}'"
    if main_stat:
        query += f" AND `Main Stat` = '{main_stat}'"
    if number_of_substats is not None:
        query += f" AND `Number of substat` = {number_of_substats}"
    if atk_percent is not None:
        query += f" AND `%ATK` = {atk_percent}"
    if hp_percent is not None:
        query += f" AND `%HP` = {hp_percent}"
    if def_percent is not None:
        query += f" AND `%DEF` = {def_percent}"
    if atk is not None:
        query += f" AND `ATK` = {atk}"
    if hp is not None:
        query += f" AND `HP` = {hp}"
    if defense is not None:
        query += f" AND `DEF` = {defense}"
    if pen is not None:
        query += f" AND `PEN` = {pen}"
    if ap is not None:
        query += f" AND `AP` = {ap}"
    if crit_rate is not None:
        query += f" AND `Crit Rate` = {crit_rate}"
    if crit_dmg is not None:
        query += f" AND `Crit DMG` = {crit_dmg}"
    if where_got_it:
        query += f" AND `Where got it` = '{where_got_it}'"
    if score:
        query += f" AND `Score` = '{score}'"

    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()

        artifacts = [
            {
                "id": row[0],
                "set": row[1],
                "type": row[2],
                "main_stat": row[3],
                "number_of_substats": row[4],
                "atk_percent": row[5],
                "hp_percent": row[6],
                "def_percent": row[7],
                "atk": row[8],
                "hp": row[9],
                "defense": row[10],
                "pen": row[11],
                "ap": row[12],
                "crit_rate": row[13],
                "crit_dmg": row[14],
                "where_got_it": row[15],
                "score": row[16],
            }
            for row in rows
        ]
    return artifacts





# API endpoint to update an artifact
@app.put("/genshinartifacts/{artifact_id}/")
def update_artifact(artifact_id: int, artifact: Artifact, db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = f"""
        UPDATE `Drive Disc` SET
            `Set` = "{artifact.set}",
            `Slot` = '{artifact.type}',
            `Main Stat` = '{artifact.main_stat}',
            `Number of substat` = {artifact.number_of_substats},
            `%ATK` = {artifact.atk_percent},
            `%HP` = {artifact.hp_percent},
            `%DEF` = {artifact.def_percent},
            `ATK` = {artifact.atk},
            `HP` = {artifact.hp},
            `DEF` = {artifact.defense},
            `PEN` = {artifact.pen},
            `AP` = {artifact.ap},
            `Crit Rate` = {artifact.crit_rate},
            `Crit DMG` = {artifact.crit_dmg},
            `Where got it` = '{artifact.where_got_it}',
            `Score` = '{artifact.score}'
        WHERE `id` = {artifact_id}
    """

    # Log the query
    logging.info(f"Executing query: {query}")



    with db.cursor() as cursor:
        cursor.execute(query)
        db.commit()
    return {"message": "Artifact updated successfully"}



# API endpoint for insert or update an artifact leveling
@app.post("/artifactleveling/")
def add_or_update_artifact_leveling(leveling: ArtifactLeveling, db: pymysql.connections.Connection = Depends(get_db_connection)):
    query_check = "SELECT * FROM `Drive Disc leveling` WHERE ID = %s"
    with db.cursor() as cursor:
        cursor.execute(query_check, (leveling.id,))
        row = cursor.fetchone()
        if row:
            query_update = f"""
            UPDATE `Drive Disc leveling` SET
                `L_HP` = {leveling.L_HP},
                `L_ATK` = {leveling.L_ATK},
                `L_DEF` = {leveling.L_DEF},
                `L_%HP` = {leveling.L_HP_per},
                `L_%ATK` = {leveling.L_ATK_per},
                `L_%DEF` = {leveling.L_DEF_per},
                `L_AP` = {leveling.L_AP},
                `L_PEN` = {leveling.L_PEN},
                `L_Crit Rate` = {leveling.L_CritRate},
                `L_Crit DMG` = {leveling.L_CritDMG},
                `Added substat` = '{leveling.addedSubstat}',
                `LastAdded` = CURDATE()
            WHERE ID = {leveling.id}
            """
            
            logger.info(f"Executing query: {query_update}")
            cursor.execute(query_update)
        else:
            query_insert = f"""
            INSERT INTO `Drive Disc leveling` (`ID`, `L_HP`, `L_ATK`, `L_DEF`, `L_%HP`, `L_%ATK`, `L_%DEF`, `L_AP`, `L_PEN`, `L_Crit Rate`, `L_Crit DMG`, `Added substat`)
            VALUES ({leveling.id}, {leveling.L_HP}, {leveling.L_ATK}, {leveling.L_DEF}, {leveling.L_HP_per}, {leveling.L_ATK_per}, {leveling.L_DEF_per}, {leveling.L_AP}, {leveling.L_PEN}, {leveling.L_CritRate}, {leveling.L_CritDMG}, '{leveling.addedSubstat}')
            """
            logger.info(f"Executing query: {query_insert}")
            cursor.execute(query_insert)
        
        db.commit()


    return {"message": "Drive Disc leveling record added or updated successfully"}


# API endpoint to fetch one artifact leveling
@app.get("/artifactleveling/{artifact_id}")
def get_artifact_leveling(artifact_id: int, db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = "SELECT * FROM `Drive Disc leveling` WHERE ID = %s"
    with db.cursor() as cursor:
        cursor.execute(query, (artifact_id,))
        row = cursor.fetchone()
        if not row:
            return None
        artifact_leveling = {
            "id": row[0],
            "L_HP": row[1],
            "L_ATK": row[2],
            "L_DEF": row[3],
            "L_HP_per": row[4],
            "L_ATK_per": row[5],
            "L_DEF_per": row[6],
            "L_AP": row[7],
            "L_PEN": row[8],
            "L_CritRate": row[9],
            "L_CritDMG": row[10],
            "addedSubstat": row[11],
        }
    return artifact_leveling



# API endpoint to fetch an artifact
@app.get("/artifact/{artifact_id}")
def get_artifact(artifact_id: int, db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = "SELECT * FROM `Drive Disc` WHERE ID = %s"
    with db.cursor() as cursor:
        cursor.execute(query, (artifact_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Artifact not found")
        
        artifact = {
            "id": row[0],
            "set": row[1],
            "type": row[2],
            "main_stat": row[3],
            "number_of_substats": row[4],
            "atk_percent": row[5],
            "hp_percent": row[6],
            "def_percent": row[7],
            "atk": row[8],
            "hp": row[9],
            "defense": row[10],
            "pen": row[11],
            "ap": row[12],
            "crit_rate": row[13],
            "crit_dmg": row[14],
            "where_got_it": row[15],
            "score": row[16],
        }
    return artifact



# API endpoint to fetch all artifact leveling list
@app.get("/artifactlevelinglist/")
def get_artifact_leveling_list(db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = """
    SELECT al.`ID`, al.`L_HP`, al.`L_ATK`, al.`L_DEF`, al.`L_%HP`, al.`L_%ATK`, al.`L_%DEF`, al.`L_AP`, al.`L_PEN`, al.`L_Crit Rate`, al.`L_Crit DMG`, al.`Added substat`,
           ai.`Set`, ai.`Slot`, ai.`Main Stat`, ai.`Number of substat`, ai.`%ATK`, ai.`%HP`, ai.`%DEF`, ai.`ATK`, ai.`HP`, ai.`DEF`, ai.`PEN`, ai.`AP`, ai.`Crit Rate`, ai.`Crit DMG`, ai.`Where got it`, ai.`Score`
    FROM `Drive Disc leveling` al
    JOIN `Drive Disc` ai ON al.ID = ai.ID
    """
    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        artifacts = [
            {
                "id": row[0],
                "L_HP": row[1],
                "L_ATK": row[2],
                "L_DEF": row[3],
                "L_HP_per": row[4],
                "L_ATK_per": row[5],
                "L_DEF_per": row[6],
                "L_AP": row[7],
                "L_PEN": row[8],
                "L_CritRate": row[9],
                "L_CritDMG": row[10],
                "addedSubstat": row[11],
                "set": row[12],
                "type": row[13],
                "main_stat": row[14],
                "number_of_substats": row[15],
                "atk_percent": row[16],
                "hp_percent": row[17],
                "def_percent": row[18],
                "atk": row[19],
                "hp": row[20],
                "defense": row[21],
                "pen": row[22],
                "ap": row[23],
                "crit_rate": row[24],
                "crit_dmg": row[25],
                "where_got_it": row[26],
                "score": row[27],
            }
            for row in rows
        ]
    return artifacts



# API endpoint for statistics of mainstat and types

@app.get("/statistics/mainstat")
def get_statistics(db: pymysql.connections.Connection = Depends(get_db_connection)):
    try:
        with db.cursor() as cursor:
            # Fetch percentages of each type
            cursor.execute("""
                SELECT `Slot`, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM `Drive Disc`) AS percentage, Count(*) as count
                FROM `Drive Disc`
                GROUP BY `Slot`
            """)
            type_percentages = cursor.fetchall()

            # Fetch percentages of each main stat grouped by type
            cursor.execute("""
                SELECT `Slot`, `Main Stat`, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM `Drive Disc` WHERE `Slot` = t.`Slot`) AS percentage, Count(*) as count
                FROM `Drive Disc` t
                GROUP BY `Slot`, `Main Stat`
            """)
            main_stat_percentages = cursor.fetchall()

        return {
            "type_percentages": type_percentages,
            "main_stat_percentages": main_stat_percentages,
        }
    except Exception as e:
        logger.error(f"Error fetching statistics: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

#API endpoint for statistics of substats

@app.get("/statistics/substats")
def get_substats_statistics(db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = """
    SELECT `Slot`, `Main Stat`, Count(`Slot`) AS TypeCount, SUM(`%ATK`) AS `%ATK`, SUM(`%HP`) AS `%HP`, SUM(`%DEF`) AS `%DEF`, SUM(`ATK`) AS `ATK`, SUM(`HP`) AS `HP`, SUM(`DEF`) AS `DEF`, SUM(`PEN`) AS `PEN`, SUM(`AP`) AS `AP`, SUM(`Crit Rate`) AS `Crit_Rate`, SUM(`Crit DMG`) AS `Crit_DMG`, SUM(`%ATK`+`%HP`+`%DEF`+`ATK`+`HP`+`DEF`+`PEN`+`AP`+`Crit Rate`+`Crit DMG`) AS `SubstatCount`
    FROM `Drive Disc`
    GROUP BY `Slot`, `Main Stat`;
    """
    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        artifacts_with_subs = [
            {
                "type": row[0],
                "main_stat": row[1],
                "ArtifactCount": row[2],
                "sub_ATK_per": row[3],
                "sub_HP_per": row[4],
                "sub_DEF_per": row[5],
                "sub_ATK": row[6],
                "sub_HP": row[7],
                "sub_DEF": row[8],
                "sub_PEN": row[9],
                "sub_AP": row[10],
                "sub_Crit_Rate": row[11],
                "sub_Crit_DMG": row[12],
                "substatCount": row[13],
                
            }
            for row in rows
        ]
    return artifacts_with_subs





@app.get("/statistics/leveling")
def get_substats_statistics(db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = """
    SELECT 
        i.`Slot`, 
        i.`Main Stat`, 
        COUNT(*) AS TypeCount, 
        SUM(`%ATK`) AS `%ATK`, 
        SUM(`%HP`) AS `%HP`, 
        SUM(`%DEF`) AS `%DEF`, 
        SUM(`ATK`) AS `ATK`, 
        SUM(`HP`) AS `HP`, 
        SUM(`DEF`) AS `DEF`, 
        SUM(`PEN`) AS `PEN`, 
        SUM(`AP`) AS `AP`, 
        SUM(`Crit Rate`) AS `Crit_Rate`, 
        SUM(`Crit DMG`) AS `Crit_DMG`, 
        SUM(`%ATK` + `%HP` + `%DEF` + `ATK` + `HP` + `DEF` + `PEN` + `AP` + `Crit Rate` + `Crit DMG`) AS `SubstatCount`, 
        SUM(`L_HP`) AS `L_HP`, 
        SUM(`L_ATK`) AS `L_ATK`, 
        SUM(`L_DEF`) AS `L_DEF`, 
        SUM(`L_%HP`) AS `L_HP_per`, 
        SUM(`L_%ATK`) AS `L_ATK_per`, 
        SUM(`L_%DEF`) AS `L_DEF_per`, 
        SUM(`L_AP`) AS `L_AP`, 
        SUM(`L_PEN`) AS `L_PEN`, 
        SUM(`L_Crit Rate`) AS `L_Crit_Rate`, 
        SUM(`L_Crit DMG`) AS `L_Crit_DMG`,
        SUM(`L_HP` + `L_ATK` + `L_DEF` + `L_%HP` + `L_%ATK` + `L_%DEF` + `L_AP` + `L_PEN` + `L_Crit Rate` + `L_Crit DMG`) AS `TotalRolls`,
        SUM(CASE WHEN l.`Added Substat` = 'ATK' THEN 1 ELSE 0 END) AS `AddedSubstat_ATK`,
        SUM(CASE WHEN l.`Added Substat` = 'DEF' THEN 1 ELSE 0 END) AS `AddedSubstat_DEF`,
        SUM(CASE WHEN l.`Added Substat` = 'HP' THEN 1 ELSE 0 END) AS `AddedSubstat_HP`,
        SUM(CASE WHEN l.`Added Substat` = '%ATK' THEN 1 ELSE 0 END) AS `AddedSubstat_%ATK`,
        SUM(CASE WHEN l.`Added Substat` = '%DEF' THEN 1 ELSE 0 END) AS `AddedSubstat_%DEF`,
        SUM(CASE WHEN l.`Added Substat` = '%HP' THEN 1 ELSE 0 END) AS `AddedSubstat_%HP`,
        SUM(CASE WHEN l.`Added Substat` = 'PEN' THEN 1 ELSE 0 END) AS `AddedSubstat_PEN`,
        SUM(CASE WHEN l.`Added Substat` = 'AP' THEN 1 ELSE 0 END) AS `AddedSubstat_AP`,
        SUM(CASE WHEN l.`Added Substat` = 'Crit Rate' THEN 1 ELSE 0 END) AS `AddedSubstat_Crit_Rate`,
        SUM(CASE WHEN l.`Added Substat` = 'Crit DMG' THEN 1 ELSE 0 END) AS `AddedSubstat_Crit_DMG`,
        SUM(CASE WHEN l.`Added Substat` = 'None' THEN 1 ELSE 0 END) AS `AddedSubstat_None`
    FROM 
        `Drive Disc leveling` l
    INNER JOIN 
        `Drive Disc` i
    ON 
        l.ID = i.ID
    GROUP BY 
        `Slot`, 
        `Main Stat`;

    """
    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        artifacts_with_subs = [
            {
                    "type": row[0],
                    "main_stat": row[1],
                    "ArtifactCount": row[2],
                    "sub_ATK_per": row[3],
                    "sub_HP_per": row[4],
                    "sub_DEF_per": row[5],
                    "sub_ATK": row[6],
                    "sub_HP": row[7],
                    "sub_DEF": row[8],
                    "sub_PEN": row[9],
                    "sub_AP": row[10],
                    "sub_Crit_Rate": row[11],
                    "sub_Crit_DMG": row[12],
                    "substatCount": row[13],
                    "roll_HP": row[14],
                    "roll_ATK": row[15],
                    "roll_DEF": row[16],
                    "roll_HP_per": row[17],
                    "roll_ATK_per": row[18],
                    "roll_DEF_per": row[19],
                    "roll_AP": row[20],
                    "roll_PEN": row[21],
                    "roll_Crit_Rate": row[22],
                    "roll_Crit_DMG": row[23],
                    "TotalRoll": row[24],
                    "added_ATK": row[25],
                    "added_DEF": row[26],
                    "added_HP": row[27],
                    "added_ATK_per": row[28],
                    "added_DEF_per": row[29],
                    "added_HP_per": row[30],
                    "added_PEN": row[31],
                    "added_AP": row[32],
                    "added_Crit_Rate": row[33],
                    "added_Crit_DMG": row[34],
                    "added_None": row[35]
                
            }
            for row in rows
        ]
    return artifacts_with_subs

#set, where got it statistics
@app.get("/set/set_where")
def get_substats_statistics(db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = """
    select `Set`, `Where got it`, count(*) as totalcount from `Drive Disc`
    group by `Set`, `Where got it`
    order by totalcount desc;
    """
    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        artifacts_with_subs = [
            {
                "set": row[0],
                "where": row[1],
                "count": row[2],
                
            }
            for row in rows
        ]
    return artifacts_with_subs


@app.get("/set/set")
def get_substats_statistics(db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = """
    select `Set`, count(*) as totalcount from `Drive Disc`
    group by `Set`
    order by totalcount desc;
    """
    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        artifacts_with_subs = [
            {
                "set": row[0],
                "count": row[1],
                
            }
            for row in rows
        ]
    return artifacts_with_subs


@app.get("/set/where")
def get_substats_statistics(db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = """
    select `Where got it`, count(*) as totalcount from `Drive Disc`
    group by `Where got it`
    order by totalcount desc;
    """
    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        artifacts_with_subs = [
            {
                "where": row[0],
                "count": row[1],
                
            }
            for row in rows
        ]
    return artifacts_with_subs