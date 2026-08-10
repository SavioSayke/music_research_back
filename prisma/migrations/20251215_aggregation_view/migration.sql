-- Aggregation view for session-track metrics
-- Note: compatible with Postgres

CREATE OR REPLACE VIEW mv_session_track_agg AS
SELECT
    s.id AS session_id,
    p.id AS participant_id,
    p."anonToken" AS participant_anon_token,
    s."stimulusSetId" AS stimulus_set_id,
    s."entryTs" AS entry_ts,
    s."exitTs" AS exit_ts,
    s.completed,
    s."totalSeconds" AS total_seconds,
    pl."trackId" AS track_id,
    COUNT(pl.id)::integer AS play_count,
    SUM(
        CASE
            WHEN pl."playedFull" THEN 1
            ELSE 0
        END
    )::integer AS played_full_count,
    AVG(r."responseTimeMs") AS average_response_ms
FROM
    "Session" s
    LEFT JOIN "Participant" p ON p.id = s."participantId"
    LEFT JOIN "Play" pl ON pl."sessionId" = s.id
    LEFT JOIN "Response" r ON r."sessionId" = s.id
GROUP BY
    s.id,
    p.id,
    p."anonToken",
    s."stimulusSetId",
    s."entryTs",
    s."exitTs",
    s.completed,
    s."totalSeconds",
    pl."trackId";
